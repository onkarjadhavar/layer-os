"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Briefcase, CheckCheck, Database, Server } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    description:
      "Great for small businesses and startups looking to get started with AI",
    price: 12,
    yearlyPrice: 99,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Up to 10 boards per workspace", icon: <Briefcase size={20} /> },
      { text: "Up to 10GB storage", icon: <Database size={20} /> },
      { text: "Limited analytics", icon: <Server size={20} /> },
    ],
    includes: [
      "Free includes:",
      "Unlimted Cards",
      "Custom background & stickers",
      "2-factor authentication",
    ],
  },
  {
    name: "Business",
    description:
      "Best value for growing businesses that need more advanced features",
    price: 48,
    yearlyPrice: 399,
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Unlimted boards", icon: <Briefcase size={20} /> },
      { text: "Storage (250MB/file)", icon: <Database size={20} /> },
      { text: "100 workspace command runs", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "Advanced checklists",
      "Custom fields",
      "Servedless functions",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Advanced plan with enhanced security and unlimited access for large teams",
    price: 96,
    yearlyPrice: 899,
    popular: true,
    buttonText: "Get started",
    buttonVariant: "default" as const,
    features: [
      { text: "Unlimited board", icon: <Briefcase size={20} /> },
      { text: "Unlimited storage ", icon: <Database size={20} /> },
      { text: "Unlimited workspaces", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Business, plus:",
      "Multi-board management",
      "Multi-board guest",
      "Attachment permissions",
    ],
  },
];

const PricingSwitch = ({
  onSwitch,
  className,
}: {
  onSwitch: (value: string) => void;
  className?: string;
}) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit sm:h-12 cursor-pointer h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0"
              ? "text-[var(--color-text-main)] font-bold"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit cursor-pointer sm:h-12 h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1"
              ? "text-[var(--color-text-main)] font-bold"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border border-[var(--color-border)] shadow-xs bg-[var(--color-surface)]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-[var(--color-sage-pale)] px-2 py-0.5 text-xs font-semibold text-[var(--color-forest)]">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export function PricingSectionReference() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.4,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="px-4 pt-12 max-w-7xl mx-auto relative"
      ref={pricingRef}
    >
      <article className="flex sm:flex-row flex-col sm:pb-0 pb-4 sm:items-center items-start justify-between">
        <div className="text-left mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold leading-[130%] text-[var(--color-text-main)] mb-3">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              Plans & Pricing
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="text-[var(--color-text-muted)] w-[80%]"
          >
            Explore flexible options designed for your farm operations.
          </TimelineContent>
        </div>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} className="shrink-0" />
        </TimelineContent>
      </article>

      <TimelineContent
        as="div"
        animationNum={2}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="grid md:grid-cols-3 gap-6 mx-auto sm:p-3 rounded-2xl"
      >
        {plans.map((plan, index) => (
          <TimelineContent
            as="div"
            key={plan.name}
            animationNum={index + 3}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative flex-col flex justify-between h-full p-6 rounded-2xl ${
                plan.popular
                  ? "ring-2 ring-[var(--color-forest)] bg-[var(--color-surface)] shadow-md"
                  : "bg-[var(--color-surface-subtle)] border border-[var(--color-border)]"
              }`}
            >
              <CardContent className="pt-0 p-0">
                <div className="space-y-2 pb-3">
                  {plan.popular && (
                    <div className="pt-1">
                      <span className="bg-[var(--color-forest)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-[var(--color-text-main)]">
                      $
                      <NumberFlow
                        format={{
                          currency: "USD",
                        }}
                        value={isYearly ? plan.yearlyPrice : plan.price}
                        className="text-4xl font-bold"
                      />
                    </span>
                    <span className="text-[var(--color-text-muted)] ml-1 text-sm">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-2xl font-bold mb-2 text-[var(--color-text-main)]">{plan.name}</h3>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                  {plan.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                  <h4 className="font-semibold text-sm mb-3 text-[var(--color-text-main)]">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-[var(--color-text-main)]">
                        <span className="text-[var(--color-forest)] h-5 w-5 bg-[var(--color-sage-pale)] rounded-full grid place-content-center mr-2.5 shrink-0">
                          <CheckCheck className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-6">
                <button
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? "bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-deep)] shadow-sm"
                      : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-border)]"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </CardFooter>
            </Card>
          </TimelineContent>
        ))}
      </TimelineContent>
    </div>
  );
}

export default PricingSectionReference;

