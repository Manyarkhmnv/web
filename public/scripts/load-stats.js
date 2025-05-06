(function () {
    window.addEventListener("load", function () {
        const statsElement = document.getElementById("stats");
        if (statsElement) {
            const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
            statsElement.textContent = `Страница загружена за ${loadTime} мс.`;
        }
    });
})();
