const GAS_URL = "https://script.google.com/macros/s/AKfycbx-HVt-CW9QQ7GqNNAY23YH8SoBtKxckU7vQQ3H0Z88M_ZPXRy6pwIpmg8kqltTVnzTxA/exec"; // TODO: 填入您部署的 GAS 網址

document.addEventListener('DOMContentLoaded', () => {
    // --- Scale to 16:9 1280x720 ---
    function resizePresentation() {
        const container = document.querySelector('.presentation-container');
        if (!container) return;
        const scaleX = window.innerWidth / 1280;
        const scaleY = window.innerHeight / 720;
        const scale = Math.min(scaleX, scaleY);
        container.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }
    window.addEventListener('resize', resizePresentation);
    resizePresentation();

    const urlParams = new URLSearchParams(window.location.search);
    const isMobileMode = urlParams.get('mode') === 'mobile';

    // --- Cover Title Typing Animation ---
    const part1 = "5分鐘";
    const part2 = "主觀機率校準訓練";
    let typeI = 0;
    let typeJ = 0;
    const title1El = document.getElementById('cover-title-1');
    const title2El = document.getElementById('cover-title-2');

    function typeTitle() {
        if (!title1El || !title2El) return;
        if (typeI < part1.length) {
            title1El.innerHTML += part1.charAt(typeI);
            typeI++;
            setTimeout(typeTitle, 150); // Typing speed
        } else if (typeJ < part2.length) {
            title2El.innerHTML += part2.charAt(typeJ);
            typeJ++;
            setTimeout(typeTitle, 150); // Typing speed
        }
    }
    
    // Start typing animation on load if not mobile
    if (!isMobileMode) {
        setTimeout(typeTitle, 500);
    }

    // --- Slide Navigation Logic ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const maxSlide = slides.length - 1;

    const btnPrev = document.getElementById('prev-slide');
    const btnNext = document.getElementById('next-slide');

    function updateSlides() {
        slides.forEach((s, i) => {
            if (i === currentSlide) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        btnPrev.style.opacity = currentSlide === 0 ? '0.3' : '1';
        btnPrev.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
        
        btnNext.style.opacity = currentSlide === maxSlide ? '0.3' : '1';
        btnNext.style.pointerEvents = currentSlide === maxSlide ? 'none' : 'auto';
    }

    btnPrev.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlides();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateSlides();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('quiz-overlay').classList.contains('active')) return;
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            if (currentSlide < maxSlide) { currentSlide++; updateSlides(); }
        } else if (e.key === 'ArrowLeft') {
            if (currentSlide > 0) { currentSlide--; updateSlides(); }
        }
    });

    updateSlides();

    // --- Quiz Engine Logic ---
    let quizQuestions = [];
    let currentQIndex = 0;
    let userAnswers = []; 
    
    let selectedBoolean = null; 
    let selectedConfidence = null; 

    // Timer State
    let questionTimer = null;
    const TIME_LIMIT = 15; // seconds per question 

    const quizOverlay = document.getElementById('quiz-overlay');
    const startBtn = document.getElementById('start-quiz-btn');
    const closeBtn = document.getElementById('close-quiz-btn');
    
    const qTypeContent = document.getElementById('q-type-content');
    const progressText = document.getElementById('quiz-progress');
    const btnTrue = document.getElementById('btn-true');
    const btnFalse = document.getElementById('btn-false');
    const confSection = document.getElementById('conf-section');
    const scaleBtns = document.querySelectorAll('.scale-btn');
    const nextQBtn = document.getElementById('next-question-btn');
    
    const qScreen = document.getElementById('question-screen');
    const rScreen = document.getElementById('result-screen');
    
    const finalScoreEl = document.getElementById('final-brier-score');
    const scoreFeedback = document.getElementById('score-feedback');
    const syncStatus = document.getElementById('sync-status');

    let typeWriterTimer = null;

    function typeWriter(text, index, cb) {
        if (index < text.length) {
            qTypeContent.innerHTML += text.charAt(index);
            typeWriterTimer = setTimeout(() => typeWriter(text, index + 1, cb), 30);
        } else {
            if (cb) cb();
        }
    }

    function initQuiz() {
        let shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
        quizQuestions = shuffled.slice(0, 10);
        currentQIndex = 0;
        userAnswers = [];
        
        qScreen.style.display = 'block';
        rScreen.classList.remove('active');
        
        showQuestion();
    }

    function showQuestion() {
        selectedBoolean = null;
        selectedConfidence = null;
        
        btnTrue.classList.remove('selected');
        btnFalse.classList.remove('selected');
        scaleBtns.forEach(b => b.classList.remove('selected'));
        confSection.classList.remove('visible');
        nextQBtn.disabled = true;

        progressText.innerText = `Q ${String(currentQIndex + 1).padStart(2, '0')} / 10`;
        
        qTypeContent.innerHTML = '';
        if (typeWriterTimer) clearTimeout(typeWriterTimer);
        
        // Start timer
        startTimer();

        // Typing effect for the question
        const qText = `${quizQuestions[currentQIndex].text}`;
        typeWriter(qText, 0);
    }

    function startTimer() {
        if (questionTimer) clearInterval(questionTimer);
        let timeLeft = TIME_LIMIT;
        
        const timerDisplay = document.getElementById('timer-display');
        const timerBar = document.getElementById('timer-bar');
        
        timerDisplay.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
        timerDisplay.style.color = 'var(--neon-orange)';
        
        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        timerBar.style.background = 'var(--neon-orange)';
        
        void timerBar.offsetWidth;
        
        timerBar.style.transition = `width ${TIME_LIMIT}s linear`;
        timerBar.style.width = '0%';
        
        questionTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                timerDisplay.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
                if (timeLeft <= 3) {
                    timerDisplay.style.color = '#FF0000';
                    timerBar.style.background = '#FF0000';
                }
            }
            if (timeLeft <= 0) {
                clearInterval(questionTimer);
                handleTimeOut();
            }
        }, 1000);
    }
    
    function handleTimeOut() {
        document.getElementById('timer-display').textContent = "TIMEOUT";
        currentQIndex++;
        if (currentQIndex < quizQuestions.length) {
            setTimeout(showQuestion, 1000);
        } else {
            setTimeout(finishQuiz, 1000);
        }
    }

    function checkReady() {
        if (selectedBoolean !== null && selectedConfidence !== null) {
            nextQBtn.disabled = false;
        }
    }

    btnTrue.addEventListener('click', () => {
        selectedBoolean = true;
        btnTrue.classList.add('selected');
        btnFalse.classList.remove('selected');
        confSection.classList.add('visible');
        checkReady();
    });

    btnFalse.addEventListener('click', () => {
        selectedBoolean = false;
        btnFalse.classList.add('selected');
        btnTrue.classList.remove('selected');
        confSection.classList.add('visible');
        checkReady();
    });

    scaleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedConfidence = parseFloat(e.target.getAttribute('data-conf'));
            scaleBtns.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            checkReady();
        });
    });

    nextQBtn.addEventListener('click', () => {
        if (questionTimer) clearInterval(questionTimer);
        const actualAnswer = quizQuestions[currentQIndex].answer;
        const outcome = actualAnswer ? 1 : 0;
        const pTrue = selectedBoolean ? selectedConfidence : (1 - selectedConfidence);
        const isCorrect = (selectedBoolean === actualAnswer);
        
        userAnswers.push({ 
            id: quizQuestions[currentQIndex].id,
            pTrue: pTrue, 
            outcome: outcome,
            statedConfidence: selectedConfidence,
            isCorrect: isCorrect
        });

        currentQIndex++;
        if (currentQIndex < quizQuestions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    });

    function finishQuiz() {
        qScreen.style.display = 'none';
        rScreen.classList.add('active');
        
        let sumSquaredErrors = 0;
        let sumConf = 0;
        let correctCount = 0;
        
        userAnswers.forEach(ans => {
            const err = ans.pTrue - ans.outcome;
            sumSquaredErrors += err * err;
            sumConf += ans.statedConfidence;
            if (ans.isCorrect) correctCount++;
        });
        
        const brierScore = sumSquaredErrors / userAnswers.length;
        const avgConf = sumConf / userAnswers.length;
        const accuracy = correctCount / userAnswers.length;
        
        let biasType = "perfect";
        if (avgConf > accuracy + 0.05) biasType = "blind";
        else if (avgConf < accuracy - 0.05) biasType = "conservative";
        window.currentBiasType = biasType;
        
        // Number animation
        let currentDisplay = 0;
        const targetDisplay = brierScore;
        const duration = 1000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = targetDisplay / steps;
        
        let count = 0;
        const timer = setInterval(() => {
            count++;
            currentDisplay += increment;
            if (count >= steps) {
                clearInterval(timer);
                currentDisplay = targetDisplay;
            }
            finalScoreEl.innerText = currentDisplay.toFixed(4);
        }, stepTime);
        
        if (brierScore < 0.1) scoreFeedback.innerText = ">> CALIBRATION: PERFECT. Superforecaster potential detected.";
        else if (brierScore < 0.2) scoreFeedback.innerText = ">> CALIBRATION: EXCELLENT. High alignment with reality.";
        else if (brierScore < 0.3) scoreFeedback.innerText = ">> CALIBRATION: ACCEPTABLE. Minor overconfidence/conservatism detected.";
        else scoreFeedback.innerText = ">> CALIBRATION: POOR. Severe noise detected. Recalibration recommended.";
        
        window.currentBrierScore = brierScore;
        
        // Actual GAS Sync Logic
        syncStatus.innerText = ">> SYNCING TO CLOUD...";
        const anonId = "anon-" + Math.random().toString(36).substring(2, 8);
        
        if (GAS_URL && !GAS_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
            const payload = {
                sessionID: anonId,
                brierScore: brierScore,
                biasType: biasType,
                responses: userAnswers.map(ans => ({
                    id: ans.id,
                    conf: ans.statedConfidence,
                    correct: ans.isCorrect
                }))
            };
            
            fetch(GAS_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            })
            .then(r => r.json())
            .then(data => {
                syncStatus.innerText = `>> DATA SYNCED [ ${anonId} ]`;
                syncStatus.style.color = "#00FF00";
            })
            .catch(err => {
                console.error(err);
                syncStatus.innerText = `>> SYNC ERROR [ ${anonId} ]`;
                syncStatus.style.color = "#FF0000";
            });
        } else {
            // Simulated for local testing without GAS URL
            setTimeout(() => {
                syncStatus.innerText = `>> DATA SYNCED [ ${anonId} ] (Local Mock)`;
                syncStatus.style.color = "#00FF00";
            }, 1500);
        }
    }

    startBtn.addEventListener('click', () => {
        quizOverlay.classList.add('active');
        initQuiz();
    });

    const mobileStartScreen = document.getElementById('mobile-start-screen');
    const mobileStartBtn = document.getElementById('btn-start-quiz');

    if (isMobileMode) {
        document.querySelector('.presentation-container').style.display = 'none';
        document.getElementById('close-quiz-btn').style.display = 'none';
        mobileStartScreen.style.display = 'flex';
        
        mobileStartBtn.addEventListener('click', () => {
            mobileStartScreen.style.display = 'none';
            quizOverlay.classList.add('active');
            initQuiz();
        });
    }

    closeBtn.addEventListener('click', () => {
        quizOverlay.classList.remove('active');
        if (currentSlide === 4) {
            currentSlide++;
            updateSlides();
        }
    });

    // --- Leaderboard/Stats Integration (Google Sheets) ---
    let histChart = null;
    let pieChart = null;

    function fetchStats() {
        if (!GAS_URL || GAS_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) return;
        
        const loadingEl = document.getElementById('stats-loading');
        const dashEl = document.getElementById('stats-dashboard');
        
        fetch(GAS_URL + "?action=getStats")
            .then(res => res.json())
            .then(data => {
                if (data.total === 0) {
                    loadingEl.innerText = "NO DATA YET";
                    return;
                }
                
                loadingEl.style.display = 'none';
                dashEl.style.display = 'block';
                
                document.getElementById('stat-total').innerText = data.total;
                document.getElementById('stat-avg').innerText = data.average.toFixed(4);
                
                // Draw Charts
                if (typeof Chart === 'undefined') return; // Wait for Chart.js to load
                
                const histCtx = document.getElementById('scoreHistogram');
                const pieCtx = document.getElementById('biasPieChart');
                if (!histCtx || !pieCtx) return;

                Chart.defaults.color = '#8A9BA8';
                Chart.defaults.font.family = "'Space Grotesk', sans-serif";
                
                // 1. Prepare Histogram Data
                const bins = [0, 0, 0, 0, 0]; // <0.1, 0.1-0.2, 0.2-0.3, 0.3-0.4, >0.4
                if (data.scores) {
                    data.scores.forEach(s => {
                        if (s < 0.1) bins[0]++;
                        else if (s < 0.2) bins[1]++;
                        else if (s < 0.3) bins[2]++;
                        else if (s < 0.4) bins[3]++;
                        else bins[4]++;
                    });
                }
                
                if (histChart) {
                    histChart.data.datasets[0].data = bins;
                    histChart.update();
                } else {
                    histChart = new Chart(histCtx.getContext('2d'), {
                        type: 'bar',
                        data: {
                            labels: ['0~0.1', '0.1~0.2', '0.2~0.3', '0.3~0.4', '>0.4'],
                            datasets: [{
                                label: '人數',
                                data: bins,
                                backgroundColor: 'rgba(0, 255, 255, 0.6)',
                                borderColor: 'rgba(0, 255, 255, 1)',
                                borderWidth: 1,
                                borderRadius: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } },
                                x: { grid: { display: false } }
                            },
                            plugins: { legend: { display: false } }
                        }
                    });
                }

                // 2. Prepare Pie Data
                const pieData = [
                    data.counts.perfect || 0,
                    data.counts.blind || 0,
                    data.counts.conservative || 0
                ];
                
                if (pieChart) {
                    pieChart.data.datasets[0].data = pieData;
                    pieChart.update();
                } else {
                    pieChart = new Chart(pieCtx.getContext('2d'), {
                        type: 'doughnut',
                        data: {
                            labels: ['完美校準', '盲目自信', '保守避險'],
                            datasets: [{
                                data: pieData,
                                backgroundColor: ['#00FF00', '#FF4500', '#4A90E2'],
                                borderWidth: 0,
                                hoverOffset: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '65%',
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: { padding: 20, usePointStyle: true }
                                }
                            }
                        }
                    });
                }
            })
            .catch(err => {
                console.error("Failed to fetch stats:", err);
                loadingEl.innerText = "ERROR LOADING DATA";
            });
    }

    // Refresh stats every 5 seconds
    setInterval(() => {
        // Only fetch if slide 6 (stats) is active
        const slide6 = document.getElementById('slide-6');
        if (slide6 && slide6.classList.contains('active')) {
            fetchStats();
        }
    }, 5000);
});
