import React from 'react';
import { motion } from 'framer-motion';
import { Reveal, LineDraw } from './motion';
import { EASING, DURATION } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * GalleryNarrative Component - Editorial gallery section for Home
 * "The Counter" - showcasing the AKAI experience through images
 */
const GalleryNarrative: React.FC = () => {
    const prefersReduced = useReducedMotion();

    const images = [
        {
            src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6wVR7Qadhk1k79FqoDvHzeMahiXYBtIRwzcVyS7zmUbfTUcJxiErZ8bRtN_1kQz5tirqARGrPTI8WYOnriCvxFzwMd9X8qRotrNtS2rK9pIQAcWaBXqRvfXW1_T96Mbug3CrKS4l2eBR9-dAoWhK_r_GobLTjsR5BETh3uw-xmU6sehGEwhkrn_C2Hu0ahfKBVShh3YfFBfbf6QsTayAZKrnVex8SwT1Kf8roRofSYuU1ZDJyyGlUZb_Ex5P_zY40c5x8s0m069bC',
            caption: 'La Barra',
            size: 'large',
        },
        {
            src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ7kjMlohgWjLKjQYLADZ62wv2qhGtSILJcoYrHx4beMd41WrX725KrU6OigGWpfi4bBBoD08c_YamXfszPn-SB4h_2a_oYT6Lw_hO5PbzZvAhhUMCJWBPsGR7uvo4ALtydLuQZdBQ8wOqrcRR94OvJm52b0wS1vQbXCrh2KSV_VzfkWe-VB5Dbu20jd57WbdmbcqYTTnogMmv5qxKzVtRQiVeyC5KPYyLWYjPUkQF457fhoBs_seNXiWbJVs8Paaxpjp84uHl8EW5',
            caption: 'El Itamae',
            size: 'medium',
        },
        {
            src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLvIc3vKY-tAVa0PzawSlGph547NrgeR-oVIKR2ERZIxc_q59guRWILp0tl_YAEy2j8mr2IJ6Ge-an7rle47we_73jCiVM6tgfOR41L2iylC5_-zTpzXDGrEJ14_ihRNyy9UcflM1GX6o3B0n2SD-ZMlx7L7G1R-DLx3wI99YmeJNCa5O8tRs1XuWitJwkIWWV8F4qL3u27MbnXKfOcK-3eXFHRKBJTQc2IQsh_XRxzGSa1uURLCHOIaIQTLpwKWqVULkHg5QMzznq',
            caption: 'Omakase',
            size: 'medium',
        },
    ];

    return (
        <section className="py-32 md:py-48 bg-akai-black relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24">
                {/* Section Header */}
                <Reveal className="mb-20" delay={0}>
                    <div className="flex items-center gap-4 mb-6">
                        <LineDraw width={32} color="#A81C1C" delay={0.2} />
                        <span className="text-akai-muted text-[10px] font-bold tracking-[0.3em] uppercase">
                            El Escenario
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-none">
                        The Counter
                    </h2>
                </Reveal>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Large Image */}
                    <Reveal
                        className="lg:col-span-7"
                        delay={0.1}
                        y={40}
                    >
                        <div className="relative group overflow-hidden aspect-[4/5]">
                            <motion.div
                                className={`absolute inset-0 bg-cover bg-center transition-all duration-[1.5s] ease-out ${prefersReduced ? '' : 'grayscale group-hover:grayscale-0 group-focus-within:grayscale-0'
                                    }`}
                                style={{ backgroundImage: `url('${images[0].src}')` }}
                                whileHover={prefersReduced ? {} : { scale: 1.05 }}
                                transition={{ duration: 1.5, ease: EASING.luxury }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8">
                                <span className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase">
                                    {images[0].caption}
                                </span>
                            </div>
                        </div>
                    </Reveal>

                    {/* Secondary Images Stack */}
                    <div className="lg:col-span-5 flex flex-col gap-8 lg:gap-12">
                        {images.slice(1).map((image, index) => (
                            <Reveal
                                key={index}
                                delay={0.2 + index * 0.15}
                                y={30}
                            >
                                <div className="relative group overflow-hidden aspect-[3/2]">
                                    <motion.div
                                        className={`absolute inset-0 bg-cover bg-center transition-all duration-[1.5s] ease-out ${prefersReduced ? '' : 'grayscale group-hover:grayscale-0 group-focus-within:grayscale-0'
                                            }`}
                                        style={{ backgroundImage: `url('${image.src}')` }}
                                        whileHover={prefersReduced ? {} : { scale: 1.05 }}
                                        transition={{ duration: 1.5, ease: EASING.luxury }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase">
                                            {image.caption}
                                        </span>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Bottom Line Separator */}
                <Reveal className="mt-20" delay={0.5}>
                    <div className="flex items-center justify-center gap-8">
                        <LineDraw width={120} color="rgba(168, 28, 28, 0.3)" delay={0.6} />
                        <div className="hanko-stamp text-xs bg-transparent border-akai-red/50 text-akai-red/80">
                            <span className="text-sm font-serif">赤</span>
                        </div>
                        <LineDraw width={120} color="rgba(168, 28, 28, 0.3)" delay={0.6} />
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default GalleryNarrative;
