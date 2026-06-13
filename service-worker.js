const CACHE_NAME = "phyflow-vn-v$(( $(echo 21) + 1 ))";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/css/main.css",
  "./assets/css/layout.css",
  "./assets/css/animation.css",
  "./assets/css/responsive.css",
  "./assets/css/math-format.css",
  "./assets/css/mindmap.css",
  "./assets/js/app.js",
  "./assets/js/router.js",
  "./assets/js/state.js",
  "./assets/js/profileStore.js",
  "./assets/js/studyTime.js",
  "./assets/js/edtechApps.js",
  "./components/edtechHub.js",
  "./assets/css/edtech-hub.css",
  "./assets/js/author.js",
  "./assets/js/contact.js",
  "./assets/js/feedback.js",
  "./assets/css/feedback.css",
  "./assets/css/author.css",
  "./assets/images/My-QR-Zalo.jpg",
  "./assets/js/utils.js",
  "./assets/js/mathFormat.js",
  "./vendor/three.module.min.js",
  "./vendor/OrbitControls.js",
  "./modules/lessonEngine.js",
  "./modules/quizEngine.js",
  "./modules/errorEngine.js",
  "./modules/visualization.js",
  "./modules/scene3d.js",
  "./modules/simulation.js",
  "./modules/progress.js",
  "./modules/gamification.js",
  "./modules/practiceContent.js",
  "./modules/mindMap.js",
  "./components/navbar.js",
  "./components/learnerSwitcher.js",
  "./components/lessonCard.js",
  "./components/quizCard.js",
  "./components/flashcardPanel.js",
  "./components/memoryPanel.js",
  "./components/modal.js",
  "./data/skills.json",
  "./data/lessons.json",
  "./data/questions.json",
  "./data/errors.json",
  "./data/exercises.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
