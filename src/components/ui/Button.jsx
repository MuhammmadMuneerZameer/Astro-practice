import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    href,
    icon: Icon,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-green-500 text-black hover:bg-green-400 hover:scale-105 shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:shadow-[0_0_30px_rgba(74,222,128,0.5)] border border-transparent",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 border border-gray-700",
        outline: "bg-transparent text-green-400 border border-green-500/30 hover:bg-green-500/10 hover:border-green-500",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
        white: "bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-lg"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const Component = href ? 'a' : 'button';

    return (
        <Component
            href={href}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
            {Icon && <Icon size={size === 'lg' ? 24 : 20} className="transition-transform group-hover:translate-x-1" />}
        </Component>
    );
}
