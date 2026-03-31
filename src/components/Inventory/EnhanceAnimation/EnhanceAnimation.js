import './EnhanceAnimation.css';

const RAYS = 12;
const PARTICLES = 16;

const EnhanceAnimation = ({ success }) => {
    const type = success ? 'ea_success' : 'ea_fail';

    const particles = Array.from({ length: PARTICLES }).map((_, i) => {
        const angle = (i / PARTICLES) * Math.PI * 2;
        const dist = 75 + Math.random() * 30;
        return {
            tx: Math.cos(angle) * dist,
            ty: Math.sin(angle) * dist,
            delay: (i / PARTICLES) * 0.18,
        };
    });

    return (
        <div className={`ea ${type}`}>
            <div className="ea_flash" />
            <div className="ea_ring" />
            <div className="ea_orb" />

            {/* Rays */}
            {Array.from({ length: RAYS }).map((_, i) => (
                <div
                    key={i}
                    className="ea_ray_wrap"
                    style={{ transform: `rotate(${(i / RAYS) * 360}deg)` }}
                >
                    <div className="ea_ray" />
                </div>
            ))}

            {/* Particles */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="ea_particle"
                    style={{
                        '--ea-tx': `${p.tx}px`,
                        '--ea-ty': `${p.ty}px`,
                        '--ea-delay': `${p.delay}s`,
                    }}
                />
            ))}

            <div className="ea_text">
                {success ? 'УЛУЧШЕНИЕ УСПЕШНО!' : 'ПРЕДМЕТ СЛОМАН'}
            </div>
        </div>
    );
};

export default EnhanceAnimation;
