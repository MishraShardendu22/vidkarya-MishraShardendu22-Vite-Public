import React from 'react';

const palette = {
  orange: '#F97316',
  green: '#38B5AA',
};

const Hero = ({ title, subtitle }) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(800px 400px at 10% 10%, ${palette.green}22, transparent), radial-gradient(800px 400px at 90% 20%, ${palette.orange}22, transparent)` }} />
      <div className="relative w-[90%] mx-auto px-4 pt-10 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-800">
          {title}
        </h1>
        <div className="mt-3 h-1 w-28 rounded-full" style={{ backgroundColor: palette.green }} />
        {subtitle && (
          <p className="mt-4 text-gray-600 max-w-2xl text-base md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;


