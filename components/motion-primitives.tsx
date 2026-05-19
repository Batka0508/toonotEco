"use client"

import { motion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion"
import { forwardRef, useRef } from "react"

const easeOut = [0.22, 1, 0.36, 1] as const

type MotionProps = HTMLMotionProps<"div"> & {
  delay?: number
}

export function FadeIn({ delay = 0, className, children, ...props }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay, ease: easeOut }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerGroup = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(function StaggerGroup({ className, children, ...props }, ref) {
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.16 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: 0.08,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
})

export function StaggerItem({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SoftZoomImage({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.9, ease: easeOut }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function HeroMotion({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: easeOut }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScrollBlurHeader({ className, children, ...props }: HTMLMotionProps<"header">) {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollY } = useScroll()
  const boxShadow = useTransform(scrollY, [0, 80], ["0 0 0 rgba(0,0,0,0)", "0 18px 55px rgba(2,6,23,0.10)"])
  const backdropFilter = useTransform(scrollY, [0, 80], ["blur(14px)", "blur(22px)"])

  return (
    <motion.header
      ref={ref}
      style={{ backdropFilter, boxShadow }}
      className={className}
      {...props}
    >
      {children}
    </motion.header>
  )
}
