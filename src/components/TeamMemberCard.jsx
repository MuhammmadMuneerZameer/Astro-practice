import { useState } from "react";
import gsap from 'gsap';
import SplitText from '../plugins/SplitText';
gsap.registerPlugin(SplitText);
export default function TeamMemberCard({ member }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full md:w-[30vw] mx-auto">
    
      <div
        className="cursor-pointer rounded-lg overflow-hidden shadow-lg"
        onClick={() => setOpen(!open)}
      >
        <img src={member.photo} alt={member.name} className={`w-full h-auto  ${open?" blur transition  ease-in-out opacity-40":""}`} />
        <div className="mt-2">
          <p className="text-sm text-gray-400">{member.role}</p>
          <h3 className="text-lg font-bold text-white">{member.name}</h3>
        </div>
      </div>

      {/* Modal / Popup */}
      {open && (
        <div className={`absolute top-0 left-0 w-full z-20  bg-opacity-90 text-white p-6 rounded-lg transition delay-150 duration-300 ease-in-out `}>
          <button
            onClick={() => setOpen(!open)}
            className="absolute top-3 right-4 text-sm text-gray-300 hover:text-white"
          >
            Close ✕
          </button>
          <div className="text-left flex flex-col justify-end">
            <p className="text-sm mb-1">{member.title}</p>
          <h4 className="text-xl font-semibold mb-2">{member.name}</h4>
          <p className="text-sm text-gray-300 mb-4">{member.description}</p>

          <div className="flex gap-4 mb-4">
            <a href={member.facebook} target="_blank" className="underline">facebook</a>
            <a href={member.linkedin} target="_blank" className="underline">linkedin</a>
          </div>
          </div>

          {/* Spotify Embed */}
          <iframe
            src={member.spotify}
            width="100%"
            height="80"
            allow="encrypted-media"
            className="rounded"
          ></iframe>
        </div>
      )}
    </div>
  );
}
