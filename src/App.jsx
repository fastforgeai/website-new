import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  ArrowUpRight,
  Activity, 
  Settings, 
  Zap, 
  Cpu, 
  Rocket, 
  Car, 
  Smartphone, 
  Microscope, 
  Stethoscope,
  Factory,
  Github, 
  Linkedin, 
  Twitter,
  X
} from 'lucide-react';
import AnimatedButton from './AnimatedButton';

gsap.registerPlugin(ScrollTrigger);

// --- COMPONENTS ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['offerings', 'industries', 'team'];
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Activate if the section is mostly in the viewport
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-5 flex items-center justify-between border-b ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-border'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="font-bold text-xl tracking-tight text-text-main">FastForge</div>
      <div className="hidden md:flex items-center gap-8 text-base font-medium text-text-muted">
        <a href="#offerings" className={`link-hover transition-colors ${activeSection === 'offerings' ? 'text-text-main font-bold' : ''}`}>Our offerings</a>
        <a href="#industries" className={`link-hover transition-colors ${activeSection === 'industries' ? 'text-text-main font-bold' : ''}`}>Industries</a>
        <a href="#team" className={`link-hover transition-colors ${activeSection === 'team' ? 'text-text-main font-bold' : ''}`}>Team</a>
      </div>
      <div className="flex items-center gap-4">
        <AnimatedButton text="Talk to us" href="https://calendar.app.google/thLm3rPCH8yhR3nZ7" />
      </div>
    </nav>
  );
};

const HeroCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    
    // Grid settings
    const spacing = 40;
    const size = 3;
    let cols, rows;
    
    // Mouse state
    let mouse = { x: -1000, y: -1000, radius: 250 };
    
    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      cols = Math.floor(width / spacing) + 1;
      rows = Math.floor(height / spacing) + 1;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.003; // Increased from 0.001 to 0.003 for faster wave animation
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + (spacing / 2);
          const y = j * spacing + (spacing / 2);
          
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Base animation (wave effect)
          const wave = (Math.sin(x * 0.005 + time) + Math.cos(y * 0.005 + time)) * 0.5;
          let opacity = 0.05 + (wave + 1) * 0.15; // 0.05 to 0.35
          let scale = 1 + (wave + 1) * 0.3; // 1 to 1.6
          
          // Mouse Interaction overrides/adds to base
          if (distance < mouse.radius) {
            const factor = 1 - distance / mouse.radius;
            opacity = Math.max(opacity, 0.1 + factor * 0.6);
            scale = Math.max(scale, 1 + factor * 1.5);
          }
          
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);
          
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 1.5;
          
          // Draw +
          ctx.beginPath();
          ctx.moveTo(-size, 0);
          ctx.lineTo(size, 0);
          ctx.moveTo(0, -size);
          ctx.lineTo(0, size);
          ctx.stroke();
          
          ctx.restore();
        }
      }
      
      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
    />
  );
};

const RotatingText = () => {
  const industries = [
    "aerospace",
    "automotive",
    "consumer hardware",
    "semiconductor",
    "medical devices",
    "industrial machinery"
  ];
  
  const [index, setIndex] = useState(0);
  const [animState, setAnimState] = useState('visible'); // 'visible', 'exiting', 'entering'

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimState('exiting');
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % industries.length);
        setAnimState('entering');
        setTimeout(() => {
          setAnimState('visible');
        }, 50);
      }, 500); // Wait for exit animation
    }, 3000); // Stay on each word for 3 seconds

    return () => clearInterval(interval);
  }, [industries.length]);

  const getTransitionClasses = () => {
    switch (animState) {
      case 'visible':
        return 'transition-all duration-500 ease-out opacity-100 translate-y-0 blur-none';
      case 'exiting':
        return 'transition-all duration-500 ease-in opacity-0 -translate-y-8 blur-sm';
      case 'entering':
        return 'transition-none opacity-0 translate-y-8 blur-sm';
      default:
        return 'opacity-100 translate-y-0 blur-none';
    }
  };

  return (
    <span>
      AI-native services for<br />
      <span 
        className={`inline-block ${getTransitionClasses()}`}
        style={{ color: 'var(--btn-color)' }}
      >
        {industries[index]}
      </span>
      {" "}companies.
    </span>
  );
};

const Hero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-element', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      });
      gsap.from('.hero-canvas', {
        opacity: 0,
        duration: 2,
        ease: 'power2.inOut',
        delay: 0.8,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 pt-32 pb-16 overflow-hidden bg-transparent">
      
      {/* Background Canvas */}
      <div className={`hero-canvas absolute inset-0 z-0 mix-blend-screen`}>
        <HeroCanvas />
        {/* Gradient overlay to ensure text readability */}
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-300 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]`} />
      </div>

      {/* Centered Content */}
      <div className="flex flex-col items-center text-center w-full relative z-10 max-w-5xl mx-auto pointer-events-none">
        <h1 className="hero-element text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-[1.1] mb-14 drop-shadow-lg text-text-main min-h-[3em] md:min-h-[2.2em]">
          <RotatingText />
        </h1>
        <p 
          className="hero-element text-gray-300 text-lg md:text-xl mb-12 leading-relaxed font-medium max-w-4xl"
          style={{ textShadow: '0 0 20px rgba(173, 255, 47, 0.3), 0 0 40px rgba(173, 255, 47, 0.15)' }}
        >
          Turn manufacturing expertise into AI workflows so your teams build faster.
        </p>
        <div className="hero-element flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
          <AnimatedButton text="Talk to us" href="https://calendar.app.google/thLm3rPCH8yhR3nZ7" />
        </div>
      </div>
    </section>
  );
};

const ComponentEngineeringSvg = ({ className }) => (
  <svg viewBox="20 15 360 270" className={className || "w-full h-auto transition-transform duration-700"} xmlns="http://www.w3.org/2000/svg">
    <style>
      {`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .pulse-circle { transform-origin: center; animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .pulse-circle-2 { transform-origin: center; animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.3s; }
        .pulse-circle-3 { transform-origin: center; animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 2.6s; }
        .float-obj { animation: float 6s ease-in-out infinite; }
      `}
    </style>
    <defs>
      <radialGradient id="glowPulse" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f97316" stopOpacity="1" />
        <stop offset="50%" stopColor="#ea580c" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
      </radialGradient>
    </defs>
    <g className="float-obj">
      <circle cx="200" cy="150" r="60" fill="url(#glowPulse)" className="pulse-circle" />
      <circle cx="200" cy="150" r="60" fill="url(#glowPulse)" className="pulse-circle-2" />
      <circle cx="200" cy="150" r="60" fill="url(#glowPulse)" className="pulse-circle-3" />
      <circle cx="200" cy="150" r="20" fill="url(#coreGlow)" />
      
      <circle cx="200" cy="150" r="40" stroke="#4f46e5" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="200" cy="150" r="70" stroke="#4f46e5" strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx="200" cy="150" r="100" stroke="#4f46e5" strokeWidth="1" fill="none" opacity="0.1" />
    </g>
  </svg>
);

const ConfigAdminSvg = ({ className }) => (
  <svg viewBox="0 0 400 300" className={className || "w-full h-auto group-hover:scale-105 transition-transform duration-700"} xmlns="http://www.w3.org/2000/svg">
    <style>
      {`
        @keyframes float-disk-1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-disk-2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-disk-3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .disk-1 { animation: float-disk-1 4s ease-in-out infinite; }
        .disk-2 { animation: float-disk-2 4s ease-in-out infinite 0.5s; }
        .disk-3 { animation: float-disk-3 4s ease-in-out infinite 1s; }
      `}
    </style>
    <defs>
      <linearGradient id="diskGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#312e81" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#312e81" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="diskTop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#3730a3" stopOpacity="0.2" />
      </linearGradient>
      <radialGradient id="diskGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
      </radialGradient>
    </defs>
    <g transform="translate(200, 150)">
      <circle cx="0" cy="-20" r="100" fill="url(#diskGlow)" opacity="0.3" />
      <g className="disk-3" transform="translate(0, 50)">
        <path d="M-80,0 C-80,25 80,25 80,0 L80,25 C80,50 -80,50 -80,25 Z" fill="url(#diskGrad)" />
        <ellipse cx="0" cy="0" rx="80" ry="25" fill="url(#diskTop)" stroke="#6366f1" strokeWidth="1" opacity="0.8" />
      </g>
      <g className="disk-2" transform="translate(0, 0)">
        <path d="M-60,0 C-60,20 60,20 60,0 L60,20 C60,40 -60,40 -60,20 Z" fill="url(#diskGrad)" />
        <ellipse cx="0" cy="0" rx="60" ry="20" fill="url(#diskTop)" stroke="#6366f1" strokeWidth="1" opacity="0.9" />
      </g>
      <g className="disk-1" transform="translate(0, -45)">
        <path d="M-40,0 C-40,15 40,15 40,0 L40,15 C40,30 -40,30 -40,15 Z" fill="url(#diskGrad)" />
        <ellipse cx="0" cy="0" rx="40" ry="15" fill="url(#diskTop)" stroke="#818cf8" strokeWidth="1" opacity="1" />
        <ellipse cx="0" cy="0" rx="20" ry="7" fill="#f97316" opacity="0.8" filter="blur(2px)" />
      </g>
    </g>
  </svg>
);

const IntegrationsSvg = ({ className }) => (
  <svg viewBox="0 0 400 300" className={className || "w-full h-auto group-hover:scale-105 transition-transform duration-700"} xmlns="http://www.w3.org/2000/svg">
    <style>
      {`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px #6366f1); transform: scale(1); }
          50% { filter: drop-shadow(0 0 15px #818cf8); transform: scale(1.1); }
        }
        .line-anim { stroke-dasharray: 5, 5; animation: dash 1s linear infinite; }
        .node { transform-origin: center; animation: glow 3s ease-in-out infinite; }
        .node-2 { transform-origin: center; animation: glow 3s ease-in-out infinite 1s; }
        .node-3 { transform-origin: center; animation: glow 3s ease-in-out infinite 2s; }
      `}
    </style>
    <g transform="translate(200, 150)">
      <path d="M-80,-50 L80,-50 L0,50 Z" fill="none" stroke="#4f46e5" strokeWidth="2" opacity="0.3" />
      <path d="M-80,-50 L80,-50 L0,50 Z" fill="none" stroke="#818cf8" strokeWidth="2" className="line-anim" />
      
      <circle cx="-80" cy="-50" r="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" className="node" />
      <circle cx="-80" cy="-50" r="6" fill="#a5b4fc" className="node" />
      
      <circle cx="80" cy="-50" r="20" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" className="node-2" />
      <circle cx="80" cy="-50" r="8" fill="#c4b5fd" className="node-2" />
      
      <circle cx="0" cy="50" r="24" fill="#1e1b4b" stroke="#f97316" strokeWidth="2" className="node-3" />
      <circle cx="0" cy="50" r="10" fill="#fdba74" className="node-3" />
    </g>
  </svg>
);

const ImplementationSvg = ({ className }) => (
  <svg viewBox="0 0 400 300" className={className || "w-full h-auto group-hover:scale-105 transition-transform duration-700"} xmlns="http://www.w3.org/2000/svg">
    <style>
      {`
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          50% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        @keyframes barGrow {
          0%, 100% { transform: scaleY(0.6); }
          50% { transform: scaleY(1); }
        }
        .arrow { animation: slideUp 3s ease-in-out infinite; }
        .arrow-2 { animation: slideUp 3s ease-in-out infinite 1s; }
        .arrow-3 { animation: slideUp 3s ease-in-out infinite 2s; }
        .bar-1 { transform-origin: bottom; animation: barGrow 4s ease-in-out infinite; }
        .bar-2 { transform-origin: bottom; animation: barGrow 4s ease-in-out infinite 1.3s; }
        .bar-3 { transform-origin: bottom; animation: barGrow 4s ease-in-out infinite 2.6s; }
      `}
    </style>
    <defs>
      <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    <g transform="translate(100, 220)">
      <rect x="0" y="-100" width="50" height="100" fill="url(#barGrad)" rx="6" className="bar-1" />
      <rect x="75" y="-150" width="50" height="150" fill="url(#barGrad)" rx="6" className="bar-2" />
      <rect x="150" y="-200" width="50" height="200" fill="url(#barGrad)" rx="6" className="bar-3" />
    </g>
    
    <g transform="translate(125, 100)">
      <path d="M0,25 L12,0 L24,25" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="arrow" />
      <path d="M0,45 L12,20 L24,45" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="arrow-2" />
    </g>
    <g transform="translate(200, 50)">
      <path d="M0,25 L12,0 L24,25" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="arrow-2" />
      <path d="M0,45 L12,20 L24,45" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="arrow-3" />
    </g>
    <g transform="translate(275, 0)">
      <path d="M0,25 L12,0 L24,25" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="arrow-3" />
      <path d="M0,45 L12,20 L24,45" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="arrow" />
    </g>
  </svg>
);

const Offerings = () => {
  const containerRef = useRef(null);
  
  const offerings = [
    { 
      title: 'Component Intelligence', 
      icon: Cpu, 
      desc: 'Smarter part decisions, from selection to obsolescence.',
      extendedDesc: [
        'Intelligent BOM & in-part selection guidance',
        'Plain-language PLM readability & classification',
        'Instant alternative component discovery',
        'Proactive obsolescence alerts & spec navigation'
      ],
      SvgComp: ComponentEngineeringSvg
    },
    { 
      title: 'AI Context Graph', 
      icon: Settings, 
      desc: 'One source of truth from all your fragmented documents.',
      extendedDesc: [
        'Centralizes reports, PPTs, Excel & more',
        'Instant information extraction across file types',
        'Continuously expanding organizational knowledge base'
      ],
      SvgComp: ConfigAdminSvg
    },
    { 
      title: 'AI Transformation', 
      icon: Activity, 
      desc: 'Replace manual workflows with AI-powered business operations.',
      extendedDesc: [
        'End-to-end AI workflow re-engineering',
        'Legacy PLM modernization & automation',
        'Seamless ERP, MES & system integration'
      ],
      SvgComp: IntegrationsSvg
    },
    { 
      title: 'AI Quality Intelligence', 
      icon: Zap, 
      desc: 'Turn field failures and warranty data into clear action.',
      extendedDesc: [
        'Part & assembly quality history lookup',
        'Warranty trend analysis & reporting',
        'Field failure translation to actionable insights',
        'Structured root cause analysis workflows'
      ],
      SvgComp: ImplementationSvg
    }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.offering-card');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${cards.length * 100}%`,
          pin: true,
          scrub: 1,
        }
      });

      cards.forEach((card, i) => {
        if (i > 0) {
          tl.fromTo(card, 
            { y: 100, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1 }
          );
        }
        if (i < cards.length - 1) {
          tl.to(card, 
            { y: -100, opacity: 0, duration: 1 }
          );
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="offerings" className="w-full h-screen flex flex-col justify-center pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto relative bg-transparent" ref={containerRef}>
      <div className="text-center mb-6 md:mb-10 flex-shrink-0 relative z-10">
        <style>
          {`
            @keyframes gradientPan {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .text-gradient-animated {
              background: linear-gradient(to right, #f97316, #ec4899, #4f46e5, #f97316);
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
              animation: gradientPan 4s linear infinite;
            }
          `}
        </style>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-10 pb-2 inline-block text-gradient-animated">
          Our offerings
        </h2>
        <p className="text-text-muted text-lg max-w-2xl mx-auto relative z-10">
          Manage components, unify knowledge, transform operations, and turn quality data into decisions.
        </p>
      </div>

      <div className="relative w-full grid grid-cols-1 grid-rows-1 flex-grow min-h-0 pb-12">
        {offerings.map((offering, i) => (
          <div 
            key={i} 
            className="offering-card col-start-1 row-start-1 flex items-center justify-center min-h-0 h-full"
            style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'translateY(0)' : 'translateY(100px)' }}
          >
            <div className="w-full h-full max-h-full overflow-y-auto bg-surface backdrop-blur-md border border-border rounded-3xl p-[clamp(1.25rem,4vw,3rem)] shadow-xl flex flex-row gap-[clamp(1rem,4vw,2.5rem)] items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              
              {/* Card Content */}
              <div className="w-1/2 flex flex-col items-start justify-center flex-shrink-0">
                <div className="mb-[clamp(0.75rem,2vw,1.5rem)] p-[clamp(0.5rem,1vw,1rem)] border border-border text-text-main rounded-2xl bg-white/5 inline-flex">
                  {React.createElement(offering.icon, { className: "w-[clamp(1.25rem,3vw,2rem)] h-[clamp(1.25rem,3vw,2rem)]", strokeWidth: 1.5 })}
                </div>
                <h3 className="text-[clamp(1.5rem,3vw+1rem,3rem)] font-medium mb-[clamp(0.5rem,1.5vw,1.25rem)] text-text-main leading-tight">{offering.title}</h3>
                <p className="text-text-muted text-[clamp(0.875rem,1.5vw+0.5rem,1.25rem)] leading-relaxed mb-[clamp(1.25rem,3vw,2rem)]">{offering.desc}</p>
                
                <div className="space-y-[clamp(0.5rem,1.5vw,1rem)] w-full">
                  {offering.extendedDesc.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-[clamp(0.5rem,1vw,0.75rem)]">
                      <div className="w-[clamp(4px,0.5vw,6px)] h-[clamp(4px,0.5vw,6px)] rounded-full bg-[#f97316] mt-[clamp(0.35rem,1vw,0.6rem)] flex-shrink-0"></div>
                      <p className="text-text-muted text-[clamp(0.8rem,1.2vw+0.4rem,1.125rem)] leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SVG Component */}
              <div className="w-1/2 flex items-center justify-center flex-1 min-h-0 min-w-0">
                <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-full">
                  {React.createElement(offering.SvgComp, { className: "w-full h-auto object-contain" })}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Industries = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const industries = [
    { title: 'Aerospace & defense', icon: Rocket, desc: 'Mission-critical component traceability and rigorous compliance tracking for defense standards.' },
    { title: 'Automotive', icon: Car, desc: 'High-volume supply chain integration and rapid iteration cycles for modern vehicle platforms.' },
    { title: 'Consumer hardware', icon: Smartphone, desc: 'Agile BOM management and rapid prototyping support for fast-paced consumer markets.' },
    { title: 'Semiconductor', icon: Microscope, desc: 'Precision lifecycle management and yield optimization for silicon manufacturing.' },
    { title: 'Medical devices', icon: Stethoscope, desc: 'FDA-compliant documentation and strict revision control for life-saving technologies.' },
    { title: 'Industrial machinery', icon: Factory, desc: 'Predictive maintenance and lifecycle tracking for heavy industrial equipment.' }
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % industries.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [industries.length, isHovered]);

  return (
    <section id="industries" className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-transparent">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4 text-text-main">Industries</h2>
        <p className="text-text-muted text-lg max-w-2xl">
          Engineered solutions across specialized hardware sectors.
        </p>
      </div>

      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          // Optional: we can let it resume from where it was
        }}
      >
        {industries.map((ind, i) => (
          <div 
            key={i} 
            className={`grid-cell p-10 md:p-12 border-r border-b backdrop-blur-sm transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group relative ${
              activeIndex === i && !isHovered 
                ? `active-cell bg-surface -translate-y-2 border-[var(--btn-color)] z-10 scale-[1.02] shadow-[0_30px_60px_rgba(0,0,0,0.6)]` 
                : 'bg-transparent translate-y-0 shadow-none border-border z-0 scale-100'
            } hover:!bg-surface hover:!-translate-y-2 hover:!border-[var(--btn-color)] hover:!z-10 hover:!scale-[1.02] hover:!shadow-[0_30px_60px_rgba(0,0,0,0.6)]`}
          >
            <ind.icon className={`mb-6 transition-colors duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${activeIndex === i && !isHovered ? 'text-[var(--btn-color)]' : 'text-text-muted'} group-hover:!text-[var(--btn-color)]`} size={32} strokeWidth={1.5} />
            <h3 className="text-xl font-medium mb-3 text-text-main">{ind.title}</h3>
            <p className="text-text-muted text-sm leading-relaxed">{ind.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Team = () => {
  const teamMembers = [
    { name: 'Alok Kumar', role: 'Co-Founder', img: '/alok_kumar.jpg', linkedin: 'https://www.linkedin.com/in/alok-kumar-u/' },
    { name: 'Parth Paradkar', role: 'Co-Founder', img: '/parth_paradkar.jpeg', linkedin: 'https://www.linkedin.com/in/parth-paradkar/' },
    { name: 'Sarthak Johnson Prasad', role: 'Co-Founder', img: '/sarthak_jp.jpg', linkedin: 'https://www.linkedin.com/in/sarthak-johnson-prasad-203702182/' }
  ];

  return (
    <section id="team" className="py-24 px-6 md:px-12 max-w-7xl mx-auto bg-transparent">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6 leading-tight text-text-main">
            Built by people who've done it at scale.
          </h2>
          <p className="text-text-muted mb-8 leading-relaxed">
            We have shipped hardware at Urban Company, advised companies at L.E.K. Consulting, engineered products that reached 600 million users at Cisco, and deployed enterprise AI inside the world's strictest compliance environments.
          </p>
        </div>
        
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <div key={i} className="flex flex-col group">
              <div className="aspect-[4/5] mb-4 bg-surface backdrop-blur-md border border-border overflow-hidden rounded-2xl relative">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" 
                />
              </div>
              <h4 className="text-lg font-medium text-text-main">{member.name}</h4>
              <p className="text-text-muted text-sm mt-1 mb-3">{member.role}</p>
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1 text-sm font-medium text-[var(--btn-color)] hover:opacity-80 transition-opacity w-fit"
              >
                <Linkedin size={16} /> <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-transparent text-text-main pt-20 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-16">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-text-main">FastForge</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              Precision-engineered services to accelerate your hardware development lifecycle.
            </p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} FastForge. All rights reserved.
          </div>
          
          <div className={`flex items-center gap-3 px-4 py-2 border border-border rounded-full bg-white/5`}>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-medium tracking-wide text-text-muted uppercase">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Divider = () => (
  <div className="border-beam-container">
    <div className="border-beam"></div>
  </div>
);

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <main className={`relative min-h-screen font-sans selection:bg-text-main selection:text-background text-text-main transition-colors duration-300 bg-[linear-gradient(to_bottom,#000000_0%,#000000_20%,#020617_50%,#0a192f_100%)]`}>
      <Navbar />
      <Hero />
      <Divider />
      <Offerings />
      <Divider />
      <Industries />
      <Divider />
      <Team />
      <Divider />
      <Footer />
    </main>
  );
}

export default App;
