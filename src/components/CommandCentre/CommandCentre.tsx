'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { MetricData } from './types'
import HelixBackbone from './HelixBackbone'
import MetricCard from './MetricCard'
import './command-centre.css'

gsap.registerPlugin(ScrollTrigger)

const METRICS: MetricData[] = [
  {
    id: 'revenue',
    label: 'Revenue growth',
    value: '+24.5%',
    delta: '+12.3% vs last qtr',
    actionLabel: 'View report',
    actionHref: '/reports/revenue',
    position: 'left',
    colorTokens: {
      fill: '#085041',
      border: '#1D9E75',
      label: '#9FE1CB',
      value: '#E1F5EE',
      delta: '#5DCAA5',
      actionFill: '#04342C',
      actionText: '#9FE1CB',
      actionBorder: '#0F6E56',
    },
  },
  {
    id: 'clients',
    label: 'Active clients',
    value: '48',
    delta: '+8 this month',
    actionLabel: 'Details',
    actionHref: '/clients',
    position: 'right',
    colorTokens: {
      fill: '#0C447C',
      border: '#378ADD',
      label: '#B5D4F4',
      value: '#E6F1FB',
      delta: '#85B7EB',
      actionFill: '#042C53',
      actionText: '#B5D4F4',
      actionBorder: '#185FA5',
    },
  },
  {
    id: 'conversion',
    label: 'Conversion',
    value: '3.8%',
    delta: '+5.1% vs last qtr',
    actionLabel: 'Refresh',
    actionHref: '#',
    position: 'left',
    colorTokens: {
      fill: '#27500A',
      border: '#639922',
      label: '#C0DD97',
      value: '#EAF3DE',
      delta: '#97C459',
      actionFill: '#173404',
      actionText: '#C0DD97',
      actionBorder: '#3B6D11',
    },
  },
  {
    id: 'performance',
    label: 'Performance',
    value: '94/100',
    delta: '+3.4% this week',
    actionLabel: 'Config',
    actionHref: '/settings',
    position: 'right',
    colorTokens: {
      fill: '#712B13',
      border: '#D85A30',
      label: '#F5C4B3',
      value: '#FAECE7',
      delta: '#F0997B',
      actionFill: '#4A1B0C',
      actionText: '#F5C4B3',
      actionBorder: '#993C1D',
    },
  },
]

// Absolute card positions (desktop)
const CARD_POSITIONS: Record<string, React.CSSProperties> = {
  revenue:     { left: 40, top: 60 },
  clients:     { right: 40, top: 240 },
  conversion:  { left: 40, top: 420 },
  performance: { right: 40, top: 600 },
}

const AGENTS = ['Architect', 'Designer', 'Backend', 'Validator', 'Marketing', 'Booking']

// Tablet card positions (applied via CSS data attr at ≤768px)
// handled in CSS media query — card tops: 60/220/380/540

export default function CommandCentre() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      const leftCards = gsap.utils.toArray<HTMLElement>('[data-gsap="card-left"]')
      const rightCards = gsap.utils.toArray<HTMLElement>('[data-gsap="card-right"]')
      const actionBtns = gsap.utils.toArray<HTMLElement>('.action-button')

      if (prefersReducedMotion) {
        gsap.set([...leftCards, ...rightCards, ...actionBtns], {
          opacity: 1,
          x: 0,
          scale: 1,
        })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          once: true,
        },
      })

      // Left cards slide in from left
      tl.from(leftCards, {
        x: -40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // Right cards slide in from right (100ms after first left card)
      tl.from(
        rightCards,
        {
          x: 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power3.out',
        },
        0.1
      )

      // Action buttons fade in after parent cards
      tl.from(
        actionBtns,
        {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          stagger: 0.08,
          ease: 'power3.out',
        },
        0.6
      )
    },
    { scope: containerRef }
  )

  return (
    <section className="command-centre command-centre-root" ref={containerRef}>
      <div className="command-centre__grid bento-grid">
        <div className="bento-tile bento-tile--raised mouse-light bento-span-6 live-tile" data-gsap="card-left">
          <div className="live-tile__status">
            <span className="live-tile__dot" />
            Plans in flight
          </div>
          <div className="live-tile__metric">4,820</div>
          <div className="live-tile__delta">+12% this week</div>
          <div className="hairline-spark" aria-hidden="true" />
        </div>

        <div className="bento-tile mouse-light bento-span-6 live-tile" data-gsap="card-right">
          <div className="live-tile__status">
            <span className="live-tile__dot" />
            Wireframes shipped today
          </div>
          <div className="live-tile__metric">27</div>
          <div className="live-tile__delta">3 awaiting final QA</div>
          <div className="hairline-spark" aria-hidden="true" />
        </div>

        <div className="command-centre__helix-tile bento-tile bento-tile--floating mouse-light bento-span-12 bento-row-2">
          <div className="command-centre__helix-stage">
            <HelixBackbone />

            <div className="metric-layer">
              {METRICS.map((metric) => (
                <MetricCard
                  key={metric.id}
                  data={metric}
                  style={CARD_POSITIONS[metric.id]}
                  data-gsap={metric.position === 'left' ? 'card-left' : 'card-right'}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bento-tile bento-span-6 live-tile" data-gsap="card-left">
          <div className="live-tile__status">
            <span className="live-tile__dot" />
            Agents busy
          </div>
          <div className="live-tile__metric">{AGENTS.length}</div>
          <div className="live-tile__list">
            {AGENTS.map((agent) => (
              <span key={agent} className="live-tile__chip">{agent}</span>
            ))}
          </div>
        </div>

        <div className="bento-tile bento-tile--raised mouse-light bento-span-6 live-tile" data-gsap="card-right">
          <div className="live-tile__status">
            <span className="live-tile__dot" />
            Avg delivery time
          </div>
          <div className="live-tile__metric">00:18:42</div>
          <div className="live-tile__delta">Current median across paid plans</div>
        </div>
      </div>
    </section>
  )
}
