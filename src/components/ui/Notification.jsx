import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Notification = ({
    title,
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 5000
}) => {
    useEffect(() => {
        if (isVisible && duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-brand-accent" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        error: <AlertTriangle className="w-5 h-5 text-red-400" />
    };

    const borders = {
        success: 'border-brand-accent/50',
        info: 'border-blue-500/50',
        warning: 'border-yellow-500/50',
        error: 'border-red-500/50'
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`
            fixed bottom-6 right-6 z-[2000] w-full max-w-sm
            bg-brand-neutral-900/90 backdrop-blur-xl
            border ${borders[type]}
            shadow-2xl shadow-black/50
            rounded-xl p-5
            flex items-start gap-4
          `}
                >
                    <div className="flex-shrink-0 mt-1">
                        {icons[type]}
                    </div>

                    <div className="flex-1">
                        <h4 className="text-white font-heading text-lg font-semibold leading-tight mb-1">
                            {title}
                        </h4>
                        <p className="text-brand-neutral-400 text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-brand-neutral-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Progress bar for auto-dismiss */}
                    {duration && (
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: duration / 1000, ease: "linear" }}
                            className="absolute bottom-0 left-0 h-1 bg-brand-accent/30 rounded-b-xl"
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;
