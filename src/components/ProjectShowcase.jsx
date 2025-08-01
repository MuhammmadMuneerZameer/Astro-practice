import React from "react";

export default function ProjectShowcase() {
  return (
    <div className="bg-[#0b0b0b] text-white rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-xl space-y-6">
      {/* Laptop Image */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black">
        <img
          src="src/content/concert.jpg" // replace with your image path
          alt="Pay Forward Project"
          width={50}
          className="w-full object-cover rounded-xl"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="bg-gray-800 text-sm px-3 py-1 rounded-full">UX/UI Design</span>
        <span className="bg-gray-800 text-sm px-3 py-1 rounded-full">Development</span>
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-2xl font-bold mb-1">Pay Forward Foundation</h3>
        <p className="text-gray-300 text-sm">
          Creating a clean and confident digital presence that reflects Pay Forward's mission.
        </p>
      </div>
    </div>
  );
}
