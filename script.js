/* ============================================================
   JAVETRON — Cinematic Premium JavaScript
   Awwwards-level upgrade - DARK PURPLE THEME + TEAM MODE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       0. LOGO MODE SWITCH - CINEMATIC TRANSITION
       ============================================================ */
    const logo = document.getElementById('logoSwitch');
    const body = document.body;
    const transitionOverlay = document.getElementById('transitionOverlay');
    let isTeamMode = false;
    let isTransitioning = false;

    if (logo) {
        logo.addEventListener('click', () => {
            if (isTransitioning) return;
            isTransitioning = true;

            isTeamMode = !isTeamMode;
            
            if (isTeamMode) {
                // Switch to Team Mode - Car Exit Animation
                logo.textContent = 'TEAM';
                logo.setAttribute('data-mode', 'team');
                logo.classList.add('team-mode');
                body.classList.add('transition-active');
                
                // Activate transition overlay
                transitionOverlay?.classList.add('active');
                
                // Trigger car exit animation
                if (window.CinematicCar && window.CinematicCar.carExit) {
                    window.CinematicCar.carExit().then(() => {
                        // After car exits, switch content
                        body.classList.add('team-mode');
                        body.classList.remove('transition-active');
                        transitionOverlay?.classList.remove('active');
                        
                        // Scroll to team story section
                        const teamStory = document.getElementById('team-story');
                        if (teamStory) {
                            teamStory.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        
                        // Initialize story animations
                        initStoryAnimations();
                        
                        isTransitioning = false;
                    });
                } else {
                    // Fallback if CinematicCar not ready
                    setTimeout(() => {
                        body.classList.add('team-mode');
                        body.classList.remove('transition-active');
                        transitionOverlay?.classList.remove('active');
                        
                        const teamStory = document.getElementById('team-story');
                        if (teamStory) {
                            teamStory.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        
                        initStoryAnimations();
                        isTransitioning = false;
                    }, 500);
                }
            } else {
                // Switch back to Normal Mode - Car Re-entry Animation
                logo.textContent = 'JAVITRON';
                logo.setAttribute('data-mode', 'normal');
                logo.classList.remove('team-mode');
                body.classList.add('transition-active');
                
                // Activate transition overlay
                transitionOverlay?.classList.add('active');
                
                // Switch content first
                body.classList.remove('team-mode');
                
                // Trigger car re-entry animation
                if (window.CinematicCar && window.CinematicCar.carReenter) {
                    window.CinematicCar.carReenter().then(() => {
                        body.classList.remove('transition-active');
                        transitionOverlay?.classList.remove('active');
                        
                        // Scroll to home
                        const home = document.getElementById('home');
                        if (home) {
                            home.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        
                        isTransitioning = false;
                    });
                } else {
                    // Fallback
                    setTimeout(() => {
                        body.classList.remove('transition-active');
                        transitionOverlay?.classList.remove('active');
                        
                        const home = document.getElementById('home');
                        if (home) {
                            home.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        
                        isTransitioning = false;
                    }, 500);
                }
            }
        });
    }

    // Story animations initialization
    function initStoryAnimations() {
        const storyBlocks = document.querySelectorAll('.story-block');
        
        const storyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // GSAP animation for content
                    const content = entry.target.querySelector('.story-content');
                    if (content && typeof gsap !== 'undefined') {
                        gsap.fromTo(content, 
                            { opacity: 0, y: 30 },
                            { 
                                opacity: 1, 
                                y: 0, 
                                duration: 0.8, 
                                ease: 'power2.out',
                                delay: 0.1
                            }
                        );
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        storyBlocks.forEach(block => {
            storyObserver.observe(block);
        });
    }

    /* ============================================================
       1. CUSTOM CURSOR
       ============================================================ */
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let isFollowerVisible = false;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursor) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        }

        if (!isFollowerVisible && cursorFollower) {
            followerX = mouseX;
            followerY = mouseY;
            isFollowerVisible = true;
        }
    });

    // Smooth follower via RAF
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        if (cursorFollower) {
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
        }
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Expand cursor on hoverable elements
    document.querySelectorAll('a, button, [data-cursor="link"], .carousel-btn, .dot').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor?.classList.add('expanded');
            cursorFollower?.classList.add('expanded');
        });
        el.addEventListener('mouseleave', () => {
            cursor?.classList.remove('expanded');
            cursorFollower?.classList.remove('expanded');
        });
    });


    /* ============================================================
       2. CINEMATIC LOADER
       ============================================================ */
    const cinematicLoader = document.getElementById('cinematic-loader');
    
    // Auto-fade loader after 2.5 seconds
    setTimeout(() => {
        if (cinematicLoader) {
            cinematicLoader.classList.add('fade-out');
            
            // Remove loader after fade out animation
            setTimeout(() => {
                cinematicLoader.style.display = 'none';
                // Animate navbar and hero content in
                animatePageEntry();
            }, 800);
        }
    }, 2500);

    function animatePageEntry() {
        // Stagger navbar logo and links
        const logo = document.querySelector('.logo');
        const navItems = document.querySelectorAll('.nav-links li, .nav-cta');

        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'translateY(-12px)';
            logo.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            requestAnimationFrame(() => {
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
            });
        }

        navItems.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            item.style.transition = `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.6s ease ${0.1 + i * 0.08}s`;
            requestAnimationFrame(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        });
    }


    /* ============================================================
       3. CAROUSEL LOGIC
       ============================================================ */
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const counter = document.querySelector('.slide-counter');

    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide]?.classList.remove('active');
        dots[currentSlide]?.classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide]?.classList.add('active');
        dots[currentSlide]?.classList.add('active');

        if (counter) {
            counter.textContent = `0${currentSlide + 1} / 0${slides.length}`;
        }
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6500);
    }

    nextBtn?.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
    prevBtn?.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); startAutoSlide(); });
    });

    // Swipe support for mobile
    let touchStartX = 0;
    const heroEl = document.querySelector('.hero-carousel');
    heroEl?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    heroEl?.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
            startAutoSlide();
        }
    });

    startAutoSlide();

    /* ============================================================
       JAVETRON — CinematicCar PATCHED SECTION
       Paste this entire block replacing Section 4 in script.js
       
       Changes:
       [1] FIXED SUNLIGHT — DirectionalLight is added to scene (world-space),
           not parented to camera. Car rotates but sun stays fixed from one side.
           Realistic shadow from consistent direction.
       
       [2] SCROLL CHOREOGRAPHY — 5 dramatic keyframes with cinematic angles,
           headlight close-up, top-down drone shot, sweeping side views.
       
       [3] GYROSCOPE — DeviceOrientationEvent moves the camera slightly
           when device is tilted (mobile). Desktop gets mouse-parallax fallback.
       ============================================================ */

    /* ============================================================
       4. CINEMATIC 3D CAR EXPERIENCE
       ============================================================ */

    const CinematicCar = {
        scene: null,
        camera: null,
        renderer: null,
        carModel: null,

        // Smooth look target (lerped each frame)
        lookTarget: new THREE.Vector3(0, 0.5, 0),
        targetLookTarget: new THREE.Vector3(0, 0.5, 0),

        isLoaded: false,
        scrollProgress: 0,
        maxDim: null, // Store max dimension for scroll-based scaling

        // [3] GYROSCOPE — stores device tilt offset applied on top of scroll camera
        gyroOffset: { x: 0, y: 0 },
        targetGyroOffset: { x: 0, y: 0 },
        mouseParallax: { x: 0, y: 0 }, // desktop fallback

        CONFIG: {
            modelPath: 'https://github.com/not-brajesh/Javitron/releases/download/v1.0/car.glb',
            fov: 45,

            // Responsive scaling multipliers
            desktopScale: 1,
            tabletScale: 0.8,
            mobileScale: 0.6,

            // [2] SCROLL CHOREOGRAPHY
            // 5 keyframes: Front → Low Side → Headlight → Drone → Right Sweep
            keyframes: [
                // 0% — Front-center, slightly low, dramatic
                { pos: { x: 0, y: 0.9, z: 6.0 }, lookAt: { x: 0, y: 0.4, z: 0 }, fov: 45 },
                // 25% — Low sweeping left side, nearly ground level
                { pos: { x: -4.0, y: 0.4, z: 4.0 }, lookAt: { x: 0, y: 0.5, z: 0 }, fov: 50 },
                // 50% — Headlight macro close-up (keyframe from original, kept)
                { pos: { x: -1.5, y: 0.85, z: 3.5 }, lookAt: { x: -0.9, y: 0.7, z: 2.1 }, fov: 38 },
                // 75% — Top-down drone, slight angle not perfectly vertical
                { pos: { x: 1.5, y: 8.0, z: 2.0 }, lookAt: { x: 0, y: 0, z: 0 }, fov: 55 },
                // 100% — Low right-rear, cinematic exit angle
                { pos: { x: 3.5, y: 0.6, z: -3.5 }, lookAt: { x: 0, y: 0.5, z: 0 }, fov: 45 }
            ],

            scrollScaleMultiplier: 0.2,
        },

        init() {
            const container = document.getElementById('rotating-car');
            const carContainer = document.getElementById('car-bg-container');

            if (!container || !carContainer || typeof THREE === 'undefined') {
                console.error('CinematicCar: Missing dependencies');
                return;
            }

            // Mobile detection for performance optimization
            this.isMobile = this.detectMobile();
            this.isTablet = this.detectTablet();

            // Apply mobile optimizations
            if (this.isMobile) {
                this.applyMobileOptimizations();
            }

            container.style.width = '100%';
            container.style.height = '100%';
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';

            this.setupScene(container);
            this.setupLighting();     // [1] Fixed sunlight setup here
            this.loadModel(container);
            this.setupCinematicScroll();
            this.setupFooterParking(carContainer);
            
            // Skip gyroscope on mobile for performance
            if (!this.isMobile) {
                this.setupGyroscope();    // [3] Gyroscope + mouse parallax
            }
            
            this.handleResize(container);
            this.animate();
        },

        detectMobile() {
            return window.innerWidth <= 600 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },

        detectTablet() {
            return window.innerWidth > 600 && window.innerWidth <= 1024;
        },

        applyMobileOptimizations() {
            // Reduce pixel ratio for better performance on mobile
            if (this.renderer) {
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            }

            // Disable antialiasing on low-end devices
            if (this.renderer && window.innerWidth < 400) {
                this.renderer.antialias = false;
            }

            // Reduce shadow map size for performance
            this.CONFIG.shadowMapSize = 2048;
        },

        setupScene(container) {
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.FogExp2(0x080810, 0.007);

            this.camera = new THREE.PerspectiveCamera(
                this.CONFIG.fov,
                container.clientWidth / container.clientHeight,
                0.1,
                100
            );

            // Apply mobile optimizations to renderer
            const pixelRatio = this.isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
            const antialias = this.isMobile && window.innerWidth < 400 ? false : true;

            this.renderer = new THREE.WebGLRenderer({
                antialias: antialias,
                alpha: true,
                powerPreference: 'high-performance',
                premultipliedAlpha: false
            });

            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(pixelRatio);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 2.4;
            this.renderer.outputEncoding = THREE.sRGBEncoding;

            container.appendChild(this.renderer.domElement);
        },

        // ─────────────────────────────────────────────────────────
        // [1] FIXED SUNLIGHT
        // All lights are added directly to this.scene (world-space).
        // The car model rotates on Y axis but the sun never moves.
        // Key light comes from upper-left-front — mimics afternoon sun.
        // Fill light is dim and from opposite side for soft shadow detail.
        // ─────────────────────────────────────────────────────────
        setupLighting() {
            // PRIMARY SUN — strong, directional, casts crisp shadows
            // Position: upper-left-front of the world. FIXED forever.
            const sun = new THREE.DirectionalLight(0xfff5e0, 6.0); // warm white
            sun.position.set(-8, 12, 6);   // left side, high, slightly forward
            sun.castShadow = true;
            const shadowSize = this.isMobile ? 2048 : 4096;
            sun.shadow.mapSize.set(shadowSize, shadowSize);
            sun.shadow.camera.near = 0.5;
            sun.shadow.camera.far = 40;
            sun.shadow.camera.left = -6;
            sun.shadow.camera.right = 6;
            sun.shadow.camera.top = 6;
            sun.shadow.camera.bottom = -6;
            sun.shadow.bias = -0.0001;
            sun.shadow.radius = 4;         // soft shadow edges
            this.scene.add(sun);

            // FILL LIGHT — opposite side, very dim, reveals shadow detail
            const fill = new THREE.DirectionalLight(0xc0d8ff, 1.2); // cool blue fill
            fill.position.set(10, 4, -4);  // right-back, low
            this.scene.add(fill);

            // AMBIENT — low intensity, prevents pure black shadows
            const ambient = new THREE.AmbientLight(0x334455, 0.8);
            this.scene.add(ambient);

            // RIM LIGHT — back edge highlight, separates car from bg
            const rim = new THREE.SpotLight(0x88aaff, 3.0);
            rim.position.set(4, 6, -8);
            rim.lookAt(0, 0, 0);
            rim.penumbra = 0.6;
            rim.angle = Math.PI / 5;
            this.scene.add(rim);

            // UNDERBODY RED ACCENT GLOW — brand color, subtle
            const under = new THREE.PointLight(0xc8102e, 1.2, 8);
            under.position.set(0, -1.5, 1);
            this.scene.add(under);

            // GROUND SHADOW PLANE — receives shadows only, transparent
            const groundGeo = new THREE.PlaneGeometry(200, 200);
            const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
            const ground = new THREE.Mesh(groundGeo, groundMat);
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -0.05;
            ground.receiveShadow = true;
            this.scene.add(ground);
        },

        loadModel(container) {
            if (typeof THREE.GLTFLoader === 'undefined') {
                console.error('CinematicCar: GLTFLoader not loaded');
                return;
            }

            const loader = new THREE.GLTFLoader();

            loader.load(
                this.CONFIG.modelPath,
                (gltf) => {
                    this.carModel = gltf.scene;

                    const box = new THREE.Box3().setFromObject(this.carModel);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());

                    const maxDim = Math.max(size.x, size.y, size.z);
                    this.maxDim = maxDim; // Store for scroll-based scaling

                    // Apply responsive scaling multiplier
                    let scaleMultiplier = this.CONFIG.desktopScale;
                    if (this.isMobile) {
                        scaleMultiplier = this.CONFIG.mobileScale;
                    } else if (this.isTablet) {
                        scaleMultiplier = this.CONFIG.tabletScale;
                    }

                    // Increase base scale by 2x (from 2.0 to 4.0)
                    const targetScale = (4.0 / maxDim) * scaleMultiplier;
                    this.carModel.scale.setScalar(targetScale);
                    this.carModel.position.sub(center.multiplyScalar(targetScale));
                    this.carModel.position.y += 0.4;

                    // [1] Physically-based materials — shiny metallic car paint
                    // roughness low → sharp reflections that react to fixed lights
                    this.carModel.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                            if (node.material) {
                                node.material.roughness = 0.05;
                                node.material.metalness = 0.92;
                                if (node.material.clearcoat !== undefined) {
                                    node.material.clearcoat = 1.0;
                                    node.material.clearcoatRoughness = 0.01;
                                }
                                node.material.emissive = new THREE.Color(0x111122);
                                node.material.emissiveIntensity = 0.08;
                            }
                        }
                    });

                    this.scene.add(this.carModel);
                    this.isLoaded = true;

                    // Entry animation
                    gsap.from(this.carModel.scale, {
                        x: 0.05, y: 0.05, z: 0.05,
                        duration: 2.0,
                        ease: 'back.out(1.4)'
                    });
                    gsap.from(this.carModel.rotation, {
                        y: Math.PI * 0.6,
                        duration: 2.2,
                        ease: 'power2.out'
                    });
                },
                undefined,
                (err) => {
                    console.error('CinematicCar: Model load failed', err);
                }
            );
        },

        // Smooth bezier interpolation between keyframes
        cubicBezier(t, p0, p1, p2, p3) {
            const u = 1 - t;
            return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
        },

        getCinematicPosition(progress) {
            const frames = this.CONFIG.keyframes;
            const totalFrames = frames.length - 1;
            const rawIndex = progress * totalFrames;
            const index = Math.min(Math.floor(rawIndex), totalFrames - 1);
            const t = rawIndex - index;

            const current = frames[index];
            const next = frames[index + 1] || frames[totalFrames];
            const smoothT = gsap.parseEase('power2.inOut')(t);

            const lerp = (a, b, t) => a + (b - a) * t;
            const bez = (a, b, t) => {
                const mid1 = a + (b - a) * 0.35;
                const mid2 = a + (b - a) * 0.65;
                return this.cubicBezier(smoothT, a, mid1, mid2, b);
            };

            return {
                pos: {
                    x: bez(current.pos.x, next.pos.x, smoothT),
                    y: bez(current.pos.y, next.pos.y, smoothT),
                    z: bez(current.pos.z, next.pos.z, smoothT)
                },
                lookAt: {
                    x: lerp(current.lookAt.x, next.lookAt.x, smoothT),
                    y: lerp(current.lookAt.y, next.lookAt.y, smoothT),
                    z: lerp(current.lookAt.z, next.lookAt.z, smoothT)
                },
                fov: lerp(current.fov, next.fov, smoothT)
            };
        },

        setupCinematicScroll() {
            const checkModel = setInterval(() => {
                if (!this.carModel) return;
                clearInterval(checkModel);
                this.createSmoothTimeline();
            }, 200);
        },

        createSmoothTimeline() {
            const initial = this.CONFIG.keyframes[0];
            this.camera.position.set(initial.pos.x, initial.pos.y, initial.pos.z);
            this.lookTarget.set(initial.lookAt.x, initial.lookAt.y, initial.lookAt.z);

            ScrollTrigger.create({
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 3.0,
                onUpdate: (self) => {
                    this.scrollProgress = self.progress;
                    const frame = this.getCinematicPosition(self.progress);

                    // Smooth camera lerp toward keyframe target
                    const lerpSpeed = 0.1;
                    this.camera.position.x += (frame.pos.x - this.camera.position.x) * lerpSpeed;
                    this.camera.position.y += (frame.pos.y - this.camera.position.y) * lerpSpeed;
                    this.camera.position.z += (frame.pos.z - this.camera.position.z) * lerpSpeed;

                    this.targetLookTarget.set(frame.lookAt.x, frame.lookAt.y, frame.lookAt.z);
                    this.lookTarget.lerp(this.targetLookTarget, 0.08);

                    this.camera.fov += (frame.fov - this.camera.fov) * 0.05;
                    this.camera.updateProjectionMatrix();

                    // Scroll-based scaling for car model
                    if (this.carModel && this.maxDim) {
                        let scaleRange;
                        if (this.isMobile) {
                            scaleRange = { min: 1.5, max: 2.0 };
                        } else if (this.isTablet) {
                            scaleRange = { min: 1.2, max: 1.5 };
                        } else {
                            scaleRange = { min: 1.0, max: 1.3 };
                        }
                        
                        const scrollScale = scaleRange.min + (scaleRange.max - scaleRange.min) * self.progress;
                        const baseScale = (4.0 / this.maxDim) * (this.isMobile ? this.CONFIG.mobileScale : this.isTablet ? this.CONFIG.tabletScale : this.CONFIG.desktopScale);
                        this.carModel.scale.setScalar(baseScale * scrollScale);
                    }

                    // Car visibility — stays reasonably visible throughout
                    const isTeamMode = document.body.classList.contains('team-mode');
                    let opacity;
                    if (isTeamMode) {
                        // Team Mode: Car stays more visible and prominent
                        opacity = Math.max(0.45, 0.65 - self.progress * 0.15);
                    } else {
                        // Normal Mode: Standard visibility curve
                        opacity = Math.max(0.28, 0.55 - self.progress * 0.2);
                    }
                    const container = document.getElementById('rotating-car');
                    if (container) container.style.opacity = opacity;
                }
            });

            gsap.ticker.add(() => {
                if (this.camera) {
                    // [3] Apply gyro/mouse parallax on top of scroll camera
                    // Small additive offset so it feels responsive, not jarring
                    const gx = this.gyroOffset.x;
                    const gy = this.gyroOffset.y;
                    this.camera.position.x += gx * 0.5;
                    this.camera.position.y += gy * 0.3;
                    this.camera.lookAt(this.lookTarget);
                    // Remove offset after applying so it doesn't drift
                    this.camera.position.x -= gx * 0.5;
                    this.camera.position.y -= gy * 0.3;
                }
            });
        },

        // ─────────────────────────────────────────────────────────
        // [3] GYROSCOPE + MOUSE PARALLAX
        // Mobile: DeviceOrientationEvent — beta (front/back tilt),
        //         gamma (left/right tilt) map to camera Y and X offset.
        // Desktop: mousemove provides a parallax fallback.
        // Both are stored in targetGyroOffset and smoothly lerped
        // into gyroOffset each animation frame.
        // ─────────────────────────────────────────────────────────
        setupGyroscope() {
            const maxTilt = 0.08; // max camera offset units from tilt

            // Check for gyroscope support
            if (typeof DeviceOrientationEvent !== 'undefined') {

                // iOS 13+ requires permission
                const requestGyro = () => {
                    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                        DeviceOrientationEvent.requestPermission()
                            .then(state => {
                                if (state === 'granted') this._attachGyro(maxTilt);
                            })
                            .catch(() => { }); // silently fail if denied
                    } else {
                        // Android / older iOS — no permission needed
                        this._attachGyro(maxTilt);
                    }
                };

                // Trigger gyro on first user interaction (required for iOS)
                const firstTouch = () => {
                    requestGyro();
                    document.removeEventListener('touchstart', firstTouch);
                };
                document.addEventListener('touchstart', firstTouch, { passive: true });
            }

            // Desktop mouse parallax fallback
            document.addEventListener('mousemove', (e) => {
                // Only apply if no gyro (desktop)
                if (this._gyroActive) return;
                const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
                const ny = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
                this.targetGyroOffset.x = nx * maxTilt;
                this.targetGyroOffset.y = -ny * maxTilt * 0.5;
            }, { passive: true });
        },

        _gyroActive: false,
        _attachGyro(maxTilt) {
            this._gyroActive = true;
            window.addEventListener('deviceorientation', (e) => {
                if (e.beta === null || e.gamma === null) return;

                // beta  = front/back tilt  (−180 to 180), neutral ≈ 45–90 when holding phone
                // gamma = left/right tilt  (−90 to 90),   neutral ≈ 0
                const beta = Math.max(-45, Math.min(45, e.beta - 45)); // re-center around typical hold angle
                const gamma = Math.max(-45, Math.min(45, e.gamma));

                this.targetGyroOffset.x = (gamma / 45) * maxTilt;
                this.targetGyroOffset.y = -(beta / 45) * maxTilt * 0.5;
            }, { passive: true });
        },

        setupFooterParking(carContainer) {
            const footer = document.querySelector('.footer');
            if (!footer || !carContainer) return;

            const updateTransform = () => {
                const scrollY = window.scrollY;
                const viewportH = window.innerHeight;
                const footerTop = footer.offsetTop;
                const viewportBottom = scrollY + viewportH;
                const scrollProgress = Math.min(scrollY / (document.body.scrollHeight - viewportH), 1);
                const scale = 1 + scrollProgress * this.CONFIG.scrollScaleMultiplier;

                if (viewportBottom > footerTop) {
                    const overlap = viewportBottom - footerTop;
                    carContainer.style.transform = `translate(-50%, calc(-50% - ${overlap}px)) scale(${scale})`;
                } else {
                    carContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
                }
            };

            window.addEventListener('scroll', () => requestAnimationFrame(updateTransform), { passive: true });
            updateTransform();
        },

        handleResize(container) {
            window.addEventListener('resize', () => {
                if (!this.camera || !this.renderer) return;
                const w = container.clientWidth;
                const h = container.clientHeight;
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
            });
        },

        // ============================================================
        // CINEMATIC TRANSITION - CAR EXIT ANIMATION
        // ============================================================
        carExit() {
            return new Promise((resolve) => {
                if (!this.carModel || typeof gsap === 'undefined') {
                    resolve();
                    return;
                }

                // Store original rotation for re-entry
                this._originalRotation = this.carModel.rotation.y;

                // Subtle rotation animation - CSS handles container
                const timeline = gsap.timeline({
                    onComplete: () => {
                        resolve();
                    }
                });

                // Subtle rotation for effect
                timeline.to(this.carModel.rotation, {
                    y: this._originalRotation + Math.PI * 0.3,
                    duration: 0.6,
                    ease: 'power2.inOut'
                }, 0);
            });
        },

        // ============================================================
        // CINEMATIC TRANSITION - CAR RE-ENTRY ANIMATION
        // ============================================================
        carReenter() {
            return new Promise((resolve) => {
                if (!this.carModel || typeof gsap === 'undefined') {
                    resolve();
                    return;
                }

                // Smooth rotation back to original - CSS handles container
                const timeline = gsap.timeline({
                    onComplete: () => {
                        this._originalRotation = null;
                        resolve();
                    }
                });

                // Rotate back to original
                if (this._originalRotation !== undefined) {
                    timeline.to(this.carModel.rotation, {
                        y: this._originalRotation,
                        duration: 1.0,
                        ease: 'power3.out'
                    }, 0);
                } else {
                    resolve();
                }
            });
        },

        animate() {
            requestAnimationFrame(() => this.animate());

            const time = Date.now() * 0.001;

            // Smoothly lerp gyro offset toward target (0.06 = silky smooth)
            this.gyroOffset.x += (this.targetGyroOffset.x - this.gyroOffset.x) * 0.06;
            this.gyroOffset.y += (this.targetGyroOffset.y - this.gyroOffset.y) * 0.06;

            if (this.carModel) {
                const scrollVel = ScrollTrigger ? Math.abs(ScrollTrigger.getAll()[0]?.getVelocity() || 0) : 0;
                const isTeamMode = document.body.classList.contains('team-mode');

                if (isTeamMode) {
                    // Team Mode: Cinematic rotation and zoom
                    const scrollProgress = this.scrollProgress || 0;
                    
                    // Slight rotation based on scroll
                    const targetRotationY = scrollProgress * Math.PI * 1.5;
                    this.carModel.rotation.y += (targetRotationY - this.carModel.rotation.y) * 0.02;
                    
                    // Gentle floating with subtle zoom effect
                    this.carModel.position.y = 0.4 + Math.sin(time * 0.3) * 0.01;
                    this.carModel.rotation.z = Math.sin(time * 0.4) * 0.0005;
                } else if (scrollVel < 20) {
                    // Normal Mode: Gentle floating idle animation
                    this.carModel.position.y = 0.4 + Math.sin(time * 0.4) * 0.007;
                    this.carModel.rotation.z = Math.sin(time * 0.5) * 0.0004;
                } else {
                    this.carModel.position.y += (0.4 - this.carModel.position.y) * 0.08;
                    this.carModel.rotation.z *= 0.92;
                }
            }

            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        }
    };

    // Expose CinematicCar to global scope for animation access
    window.CinematicCar = CinematicCar;

    // Initialize after scripts loaded
    setTimeout(() => CinematicCar.init(), 500);
    /* ============================================================
       5. NAVBAR SCROLL EFFECT
       ============================================================ */
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });


    /* ============================================================
       6. HAMBURGER / MOBILE MENU
       ============================================================ */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu?.classList.toggle('open');
        document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            mobileMenu?.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    /* ============================================================
       8. SPONSOR CAROUSEL
       ============================================================ */
    const sponsorCarousel = document.getElementById('sponsorCarousel');
    const sponsorPopup = document.getElementById('sponsorPopup');
    const sponsorPopupBackdrop = document.getElementById('sponsorPopupBackdrop');
    const sponsorPopupClose = document.getElementById('sponsorPopupClose');
    const sponsorPopupName = document.getElementById('sponsorPopupName');
    const sponsorPopupTier = document.getElementById('sponsorPopupTier');
    const sponsorPopupDetails = document.getElementById('sponsorPopupDetails');

    // Duplicate sponsor items for seamless loop
    if (sponsorCarousel) {
        const sponsorItems = sponsorCarousel.querySelectorAll('.sponsor-item');
        sponsorItems.forEach(item => {
            const clone = item.cloneNode(true);
            sponsorCarousel.appendChild(clone);
        });

        // Click handler for sponsor items
        sponsorCarousel.addEventListener('click', (e) => {
            const sponsorItem = e.target.closest('.sponsor-item');
            if (sponsorItem) {
                // Stop carousel animation
                sponsorCarousel.style.animationPlayState = 'paused';

                // Show popup
                const name = sponsorItem.dataset.sponsorName;
                const desc = sponsorItem.dataset.sponsorDesc;
                const details = sponsorItem.dataset.sponsorDetails;

                sponsorPopupName.textContent = name;
                sponsorPopupTier.textContent = desc;
                sponsorPopupDetails.textContent = details;

                sponsorPopup.classList.add('active');
                sponsorPopupBackdrop.classList.add('active');
            }
        });

        // Mouse leave handler to resume animation
        sponsorCarousel.addEventListener('mouseleave', () => {
            if (!sponsorPopup.classList.contains('active')) {
                sponsorCarousel.style.animationPlayState = 'running';
            }
        });
    }

    // Close popup handlers
    const closePopup = () => {
        sponsorPopup.classList.remove('active');
        sponsorPopupBackdrop.classList.remove('active');
        // Resume carousel animation
        if (sponsorCarousel) {
            sponsorCarousel.style.animationPlayState = 'running';
        }
    };

    sponsorPopupClose?.addEventListener('click', closePopup);
    sponsorPopupBackdrop?.addEventListener('click', closePopup);


    /* ============================================================
       9. DEVELOPER POPUP
       ============================================================ */
    const devCredit = document.getElementById('devCredit');
    const devPopup = document.getElementById('devPopup');
    const devPopupBackdrop = document.getElementById('devPopupBackdrop');
    const devPopupClose = document.getElementById('devPopupClose');

    // Click handler for developer credit
    devCredit?.addEventListener('click', () => {
        devPopup.classList.add('active');
        devPopupBackdrop.classList.add('active');
    });

    // Close popup handlers
    const closeDevPopup = () => {
        devPopup.classList.remove('active');
        devPopupBackdrop.classList.remove('active');
    };

    devPopupClose?.addEventListener('click', closeDevPopup);
    devPopupBackdrop?.addEventListener('click', closeDevPopup);


    /* ============================================================
       7. INTERSECTION OBSERVER — FADE-UP ELEMENTS
       ============================================================ */
    const fadeElements = document.querySelectorAll('.fade-up');

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));


    /* ============================================================
       8. ANIMATED STAT COUNTERS
       ============================================================ */
    const statNums = document.querySelectorAll('.stat-num');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);

            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }

        requestAnimationFrame(tick);
    }

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNums.forEach(animateCounter);
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsStrip = document.querySelector('.stats-strip');
    if (statsStrip) statsObserver.observe(statsStrip);


    /* ============================================================
       9. TEAM CARD MAGNETIC TILT
       ============================================================ */
    document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const rotX = ((e.clientY - centerY) / (rect.height / 2)) * -5;
            const rotY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
            card.style.transform = `translateY(-8px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });


    /* ============================================================
       10. SHOWCASE ITEMS — PARALLAX BG SHIFT on HOVER
       ============================================================ */
    document.querySelectorAll('.showcase-item').forEach(item => {
        const img = item.querySelector('.showcase-img');
        if (!img) return;

        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
            img.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
        });

        item.addEventListener('mouseleave', () => {
            img.style.transform = '';
        });
    });


    /* ============================================================
       11. SMOOTH SECTION REVEAL — section labels stagger
       ============================================================ */
    const sectionLabels = document.querySelectorAll('.section-label');

    const labelObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.5 });

    sectionLabels.forEach(label => {
        label.style.opacity = '0';
        label.style.transform = 'translateX(-20px)';
        label.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        labelObserver.observe(label);
    });

});