// client/src/components/ThreeMic.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

function MicModel({ isListening }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
        }
    });

    return (
        <group ref={groupRef}>
            <Sphere args={[1.15]} position={[0, 0, 0]}>
                <meshStandardMaterial
                    color="#6B21A8"
                    emissive="#A855F7"
                    metalness={0.9}
                    roughness={0.1}
                />
            </Sphere>

            {/* Cyan Rings triggered directly from Context hook */}
            {isListening && (
                <>
                    {[1.7, 2.3, 2.9].map((r, i) => (
                        <Sphere key={i} args={[r]} position={[0, 0, 0]}>
                            <meshStandardMaterial
                                color="#22D3EE"
                                transparent
                                opacity={0.15 - (i * 0.05)}
                                wireframe
                            />
                        </Sphere>
                    ))}
                </>
            )}
        </group>
    );
}

export default function ThreeMic({ isListening = false }) {
    return (
        <div className="w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 relative z-10">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} color="#C026D3" intensity={1.8} />
                <pointLight position={[-10, -10, -10]} color="#22D3EE" />

                <MicModel isListening={isListening} />

                <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
