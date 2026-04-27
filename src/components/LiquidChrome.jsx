import { useRef, useEffect } from 'react';

const vertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uDistort;
  uniform vec3 uBaseColor;

  varying vec2 vUv;

  void main() {
      vec2 uv = vUv;
      uv.x *= uResolution.x / uResolution.y;

      vec2 mouse = uMouse;
      mouse.x *= uResolution.x / uResolution.y;
      float dist = distance(uv, mouse);
      float influence = smoothstep(0.6, 0.0, dist);

      for (float i = 1.0; i < 8.0; i++) {
          uv.x += 0.6 / i * cos(i * 2.5 * uv.y + uTime + (uDistort * influence * 2.0));
          uv.y += 0.6 / i * cos(i * 1.5 * uv.x + uTime + (uDistort * influence * 2.0));
      }

      vec2 grid = uv * 3.0;
      float height = sin(grid.x + grid.y);

      vec3 col = uBaseColor;
      col *= smoothstep(-1.0, 1.0, height);

      float specular = smoothstep(0.8, 1.0, sin(uv.x * 10.0 + uv.y * 10.0));
      col += vec3(1.0) * specular * 0.8;

      col.r += uDistort * 0.02;
      col.b -= uDistort * 0.02;

      gl_FragColor = vec4(col, 1.0);
  }
`;

export default function LiquidChrome({
    baseColor = [0.5, 0.5, 0.5],
    speed = 1.0,
    interactive = true,
    ...props
}) {
    const containerRef = useRef(null);
    const baseColorKey = baseColor.join(',');

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationId;
        let cancelled = false;
        let ro;
        let cleanupFn;

        import('ogl').then(({ Renderer, Program, Mesh, Triangle, Vec2 }) => {
            if (cancelled) return;

            const renderer = new Renderer({
                alpha: true,
                antialias: true,
                dpr: Math.min(window.devicePixelRatio, 2),
            });
            const gl = renderer.gl;
            gl.clearColor(0, 0, 0, 1);

            // Canvas must fill the container absolutely so it covers it
            // regardless of default inline/block canvas behaviour
            Object.assign(gl.canvas.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                display: 'block',
            });

            const geometry = new Triangle(gl);
            const program = new Program(gl, {
                vertex: vertexShader,
                fragment: fragmentShader,
                uniforms: {
                    uTime:       { value: 0 },
                    uResolution: { value: new Vec2(1, 1) },
                    uBaseColor:  { value: new Float32Array(baseColor) },
                    uMouse:      { value: new Vec2(0.5, 0.5) },
                    uDistort:    { value: 0 },
                },
            });

            const mesh = new Mesh(gl, { geometry, program });

            function resize(w, h) {
                if (!w || !h) return;
                renderer.setSize(w, h);
                program.uniforms.uResolution.value.set(w, h);
            }

            // ResizeObserver fires reliably when the element's layout size changes,
            // including the initial measurement — unlike window 'resize' alone.
            ro = new ResizeObserver((entries) => {
                const entry = entries[0];
                if (!entry) return;
                const { width, height } = entry.contentRect;
                resize(width, height);
            });
            ro.observe(container);

            // Fallback for browsers without ResizeObserver (very rare)
            const onWindowResize = () => {
                const { width, height } = container.getBoundingClientRect();
                resize(width, height);
            };
            window.addEventListener('resize', onWindowResize, { passive: true });

            let lastMouse = { x: 0.5, y: 0.5 };
            let currentDistort = 0;

            function handleMouseMove(e) {
                const rect = container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = 1.0 - (e.clientY - rect.top) / rect.height;
                program.uniforms.uMouse.value.set(x, y);
                const velX = Math.abs(x - lastMouse.x);
                const velY = Math.abs(y - lastMouse.y);
                currentDistort = Math.min(Math.sqrt(velX * velX + velY * velY) * 50.0, 5.0);
                lastMouse = { x, y };
            }

            if (interactive) {
                container.addEventListener('mousemove', handleMouseMove);
            }

            // Append canvas before starting the loop so the first frame paints correctly
            container.appendChild(gl.canvas);

            let time = 0;
            function update() {
                animationId = requestAnimationFrame(update);
                currentDistort += (0 - currentDistort) * 0.05;
                program.uniforms.uDistort.value = currentDistort;
                time += 0.005 * speed;
                program.uniforms.uTime.value = time;
                renderer.render({ scene: mesh });
            }
            animationId = requestAnimationFrame(update);

            cleanupFn = () => {
                cancelAnimationFrame(animationId);
                if (ro) ro.disconnect();
                window.removeEventListener('resize', onWindowResize);
                if (interactive) container.removeEventListener('mousemove', handleMouseMove);
                if (gl.canvas.parentElement) gl.canvas.parentElement.removeChild(gl.canvas);
            };
        }).catch(() => {
            // WebGL init failed (e.g. privacy mode, no GPU) — fail silently
        });

        return () => {
            cancelled = true;
            if (ro) ro.disconnect();
            if (cleanupFn) cleanupFn();
            else if (animationId) cancelAnimationFrame(animationId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseColorKey, speed, interactive]);

    return (
        <div
            ref={containerRef}
            style={{ position: 'relative', width: '100%', height: '100%' }}
            {...props}
        />
    );
}
