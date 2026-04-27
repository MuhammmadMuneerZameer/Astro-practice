import MuxPlayer from '@mux/mux-player-react';

export default function Splineanimation() {
  return (
    <div className='absolute inset-0 w-full h-full overflow-hidden'>
      <MuxPlayer
        playbackId="4By008QZOx3RO7XuzGi02MXg2lyqczxfQ5qiO301pEf6ig"
        autoPlay
        muted
        loop
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '177.78vh',
          height: '56.25vw',
          minWidth: '100%',
          minHeight: '100%',
          '--controls': 'none',
          '--media-object-fit': 'cover',
        }}
      />
    </div>
  );
}
