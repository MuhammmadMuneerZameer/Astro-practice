import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Target, Users, BarChart3, Globe2, Rocket } from "lucide-react";

export interface Reason {
	title: string;
	description: string;
	icon: React.ReactNode;
}

export interface FeatureSectionProps {
	heading?: string;
	reasons?: Reason[];
}

export default function FeatureSection({
	heading = "Why Choose Our Company?",
	reasons = [
		{
			title: "Trusted Security",
			description:
				"We prioritize your data privacy and implement enterprise-grade security at every layer.",
			icon: <ShieldCheck className="size-6 text-emerald-500" />,
		},
		{
			title: "Goal-Driven Approach",
			description:
				"Every project is aligned with measurable goals to ensure we drive tangible outcomes.",
			icon: <Target className="size-6 text-emerald-500" />,
		},
		{
			title: "Expert Teamwork",
			description:
				"Our team consists of skilled professionals who work collaboratively to deliver excellence.",
			icon: <Users className="size-6 text-emerald-500" />,
		},
		{
			title: "Data-Backed Results",
			description:
				"We leverage advanced analytics to provide actionable insights and data-driven decisions.",
			icon: <BarChart3 className="size-6 text-emerald-500" />,
		},
		{
			title: "Global Reach",
			description:
				"We serve clients worldwide, offering scalable solutions with international support.",
			icon: <Globe2 className="size-6 text-emerald-500" />,
		},
		{
			title: "Fast Execution",
			description:
				"With agile methodologies, we accelerate project delivery without compromising quality.",
			icon: <Rocket className="size-6 text-emerald-500" />,
		},
	],
}: FeatureSectionProps) {
	return (
		<section className="py-16 md:py-24">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="mb-12 text-center"
				>
					<h2 className="text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
						{heading}
					</h2>
				</motion.div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{reasons.map((reason, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.15 }}
							transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="cursor-pointer"
						>
							<div className="rounded-xl border border-neutral-800 bg-neutral-900 transition-transform duration-300 hover:shadow-xl hover:border-emerald-500">
								<div className="p-6">
									<div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
										{reason.icon}
									</div>
									<h3 className="text-xl font-semibold">
										{reason.title}
									</h3>
								</div>
								<div className="px-6 pb-6 pt-0">
									<p className="text-neutral-400">{reason.description}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}