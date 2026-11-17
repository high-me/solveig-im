(function () {
    var SECTIONS = ['landing', 'om-meg', 'kunstvev', 'collage', 'kontakt'];
    var BASE_TITLE = 'Solveig I. Moberg - Kunstvev & Collager';
    var SECTION_TITLES = {
        landing: BASE_TITLE,
        'om-meg': 'Litt om meg - ' + BASE_TITLE,
        kunstvev: 'Kunstvev Galleri - ' + BASE_TITLE,
        collage: 'Collage Galleri - ' + BASE_TITLE,
        kontakt: 'Kontakt - ' + BASE_TITLE
    };

    var kunstvevFiles = [
        'IMG_8661.jpg', 'IMG_8658.jpg', 'IMG_8657.jpg', 'IMG_8656.jpg', 'IMG_8654.jpg',
        'IMG_8653.jpg', 'IMG_8652.jpg', 'IMG_8650.jpg', 'IMG_8649.jpg', 'IMG_8647.jpg',
        'IMG_8645.jpg', 'IMG_8644.jpg', 'IMG_8643.jpg', 'IMG_8642.jpg', 'IMG_8641.jpg',
        'IMG_8640.jpg', 'IMG_8639.jpg', 'IMG_8638.jpg', 'IMG_8636.jpg', 'IMG_8635.jpg',
        'IMG_8633.jpg', 'IMG_8632.jpg', 'IMG_8631.jpg', 'IMG_8630.jpg', 'IMG_8629.jpg',
        'IMG_8628.jpg', 'IMG_8627.jpg', 'IMG_8626.jpg', 'IMG_8625.jpg', 'IMG_8623.jpg',
        'IMG_8621.jpg', 'IMG_8619.jpg'
    ];

    var collageFiles = [
        'IMG_8561.jpg', 'IMG_8557.jpg', 'IMG_8554.jpg', 'IMG_8552.jpg', 'IMG_8550.jpg',
        'IMG_8549.jpg', 'IMG_8548.jpg', 'IMG_8547.jpg', 'IMG_8545.jpg', 'IMG_8544.jpg',
        'IMG_8543.jpg', 'IMG_8541.jpg', 'IMG_8540.jpg', 'IMG_8539.jpg', 'IMG_8537.jpg',
        'IMG_8535.jpg', 'IMG_8534.jpg', 'IMG_8533.jpg', 'IMG_8531.jpg', 'IMG_8530.jpg',
        'IMG_8529.jpg'
    ];

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function applyThemeMeta() {
        var theme = currentTheme();
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#111111' : '#fafafa');
        var button = document.getElementById('theme-toggle');
        if (!button) return;
        var dark = theme === 'dark';
        button.setAttribute('aria-pressed', dark ? 'true' : 'false');
        button.setAttribute('aria-label', dark ? 'Bytt til lys modus' : 'Bytt til mørk modus');
    }

    function initTheme() {
        applyThemeMeta();
        var button = document.getElementById('theme-toggle');
        if (button) {
            button.addEventListener('click', function () {
                var next = currentTheme() === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                try {
                    localStorage.setItem('theme', next);
                } catch (e) {}
                applyThemeMeta();
            });
        }
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function sectionFromPath(pathname) {
        var parts = pathname.split('/').filter(Boolean);
        var name = parts.length ? parts[parts.length - 1] : 'landing';
        if (name === 'index.html') return 'landing';
        return SECTIONS.indexOf(name) !== -1 ? name : 'landing';
    }

    function pathFor(id) {
        return id === 'landing' ? '/' : '/' + id;
    }

    function loadGallery(galleryId, folder, files, label) {
        var gallery = document.getElementById(galleryId);
        if (!gallery) return [];
        if (!files.length) {
            gallery.innerHTML = '<p class="gallery-empty">Ingen bilder</p>';
            return [];
        }
        return files.map(function (filename, index) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'gallery-item';
            var img = document.createElement('img');
            img.src = folder + '/' + filename;
            img.alt = label + ', bilde ' + (index + 1);
            img.loading = 'lazy';
            img.decoding = 'async';
            button.appendChild(img);
            gallery.appendChild(button);
            return { src: img.src, alt: img.alt, trigger: button };
        });
    }

    function initHome() {
        var galleries = {
            'kunstvev-gallery': loadGallery('kunstvev-gallery', 'images/kunstvev', kunstvevFiles, 'Kunstvev'),
            'collage-gallery': loadGallery('collage-gallery', 'images/collage', collageFiles, 'Collage')
        };

        var lightbox = document.getElementById('lightbox');
        var lightboxImg = document.getElementById('lightbox-img');
        var lightboxItems = [];
        var lightboxIndex = 0;
        var lastTrigger = null;

        function showLightboxImage() {
            var item = lightboxItems[lightboxIndex];
            lightboxImg.src = item.src;
            lightboxImg.alt = item.alt;
        }

        function openLightbox(items, index, trigger) {
            lightboxItems = items;
            lightboxIndex = index;
            lastTrigger = trigger;
            showLightboxImage();
            lightbox.hidden = false;
            document.body.classList.add('lightbox-open');
            lightbox.querySelector('.lightbox-close').focus();
        }

        function closeLightbox() {
            lightbox.hidden = true;
            lightboxImg.src = '';
            lightboxImg.alt = '';
            document.body.classList.remove('lightbox-open');
            lightboxItems = [];
            if (lastTrigger) lastTrigger.focus();
        }

        function stepLightbox(direction) {
            if (!lightboxItems.length) return;
            lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
            showLightboxImage();
        }

        Object.keys(galleries).forEach(function (id) {
            galleries[id].forEach(function (item, index) {
                item.trigger.addEventListener('click', function () {
                    openLightbox(galleries[id], index, item.trigger);
                });
            });
        });

        if (lightbox) {
            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox-prev').addEventListener('click', function () {
                stepLightbox(-1);
            });
            lightbox.querySelector('.lightbox-next').addEventListener('click', function () {
                stepLightbox(1);
            });
            lightbox.addEventListener('click', function (event) {
                if (event.target === lightbox) closeLightbox();
            });
            document.addEventListener('keydown', function (event) {
                if (lightbox.hidden) return;
                if (event.key === 'Escape') {
                    closeLightbox();
                } else if (event.key === 'ArrowRight') {
                    stepLightbox(1);
                } else if (event.key === 'ArrowLeft') {
                    stepLightbox(-1);
                } else if (event.key === 'Tab') {
                    var buttons = Array.prototype.slice.call(lightbox.querySelectorAll('button'));
                    var first = buttons[0];
                    var last = buttons[buttons.length - 1];
                    if (event.shiftKey && document.activeElement === first) {
                        event.preventDefault();
                        last.focus();
                    } else if (!event.shiftKey && document.activeElement === last) {
                        event.preventDefault();
                        first.focus();
                    }
                }
            });
        }

        function setActive(id) {
            document.querySelectorAll('.site-nav a').forEach(function (link) {
                if (link.getAttribute('data-section') === id) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
            document.title = SECTION_TITLES[id] || BASE_TITLE;
        }

        var scrollLock = 0;

        function showSection(id, instant) {
            var section = document.getElementById(id);
            if (!section) return;
            var behavior = instant || prefersReducedMotion() ? 'instant' : 'smooth';
            var token = ++scrollLock;
            section.scrollIntoView({ behavior: behavior, block: 'start' });
            setActive(id);
            if (behavior !== 'smooth') {
                scrollLock = 0;
                return;
            }
            var release = function () {
                if (token !== scrollLock) return;
                scrollLock = 0;
                window.removeEventListener('scrollend', release);
            };
            window.addEventListener('scrollend', release);
            window.setTimeout(release, 1200);
        }

        document.querySelectorAll('[data-section]').forEach(function (link) {
            link.addEventListener('click', function (event) {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                event.preventDefault();
                var id = link.getAttribute('data-section');
                showSection(id, false);
                var nextPath = pathFor(id);
                if (window.location.pathname !== nextPath) {
                    history.pushState({ section: id }, '', nextPath);
                }
                if (window.siteMenu) window.siteMenu.close();
                var heading = document.getElementById(id).querySelector('h1, h2');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus({ preventScroll: true });
                }
            });
        });

        window.addEventListener('popstate', function (event) {
            var id = event.state && event.state.section ? event.state.section : sectionFromPath(window.location.pathname);
            showSection(id, false);
            if (window.siteMenu) window.siteMenu.close();
        });

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                if (scrollLock) return;
                var visible = entries
                    .filter(function (entry) { return entry.isIntersecting; })
                    .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
                if (visible) setActive(visible.target.id);
            }, { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4] });
            SECTIONS.forEach(function (id) {
                var section = document.getElementById(id);
                if (section) observer.observe(section);
            });
        }

        var params = new URLSearchParams(window.location.search);
        var success = params.get('success') === '1';
        var hash = window.location.hash.replace('#', '');
        var initial = success ? 'kontakt' : sectionFromPath(window.location.pathname);
        if (!success && initial === 'landing' && SECTIONS.indexOf(hash) !== -1) initial = hash;
        showSection(initial, true);
        if (success) {
            var formResponse = document.getElementById('form-response');
            if (formResponse) {
                formResponse.textContent = 'Meldingen din er sendt!';
                formResponse.className = 'form-response success';
            }
        }
        history.replaceState({ section: initial }, '', pathFor(initial));

        var form = document.getElementById('kontakt-form');
        var submitButton = document.getElementById('submit-button');
        if (form && submitButton) {
            var fields = form.querySelectorAll('input:not([type="hidden"]), textarea');

            function checkFormValidity() {
                var valid = true;
                fields.forEach(function (field) {
                    if (!field.checkValidity()) valid = false;
                });
                submitButton.disabled = !valid;
            }

            fields.forEach(function (field) {
                field.addEventListener('input', checkFormValidity);
                field.addEventListener('change', checkFormValidity);
            });
            checkFormValidity();

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                var responseBox = document.getElementById('form-response');
                var originalText = submitButton.textContent;
                submitButton.textContent = 'Sender…';
                submitButton.disabled = true;
                responseBox.textContent = '';
                responseBox.className = 'form-response';

                fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                })
                    .then(function (response) {
                        if (!response.ok) throw new Error('request failed');
                        responseBox.textContent = 'Meldingen din er sendt!';
                        responseBox.className = 'form-response success';
                        form.reset();
                    })
                    .catch(function () {
                        responseBox.textContent = 'En feil oppstod. Vennligst prøv igjen senere.';
                        responseBox.className = 'form-response error';
                    })
                    .finally(function () {
                        submitButton.textContent = originalText;
                        checkFormValidity();
                    });
            });
        }
    }

    function initMenu() {
        var nav = document.getElementById('site-nav');
        var navToggle = document.querySelector('.nav-toggle');
        if (!nav || !navToggle) return;

        function closeMenu() {
            nav.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Meny');
        }

        navToggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            navToggle.setAttribute('aria-label', open ? 'Lukk meny' : 'Meny');
        });

        document.addEventListener('click', function (event) {
            if (!nav.classList.contains('is-open')) return;
            if (nav.contains(event.target) || navToggle.contains(event.target)) return;
            closeMenu();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape' || !nav.classList.contains('is-open')) return;
            var lightbox = document.getElementById('lightbox');
            if (lightbox && !lightbox.hidden) return;
            closeMenu();
            navToggle.focus();
        });

        window.siteMenu = { close: closeMenu };
    }

    document.addEventListener('DOMContentLoaded', function () {
        initTheme();
        initMenu();
        if (document.getElementById('landing')) initHome();
    });
})();
