import Spline from '@splinetool/react-spline';

export default function Splineanimation() {
  return (
    <div className='absolute inset-0 w-full h-full overflow-hidden'>
      <Spline className='w-full h-full bg-black' scene="https://prod.spline.design/3sYAExF09wA96xRS/scene.splinecode" />
    </div>
  );
}
