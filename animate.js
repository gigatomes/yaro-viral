document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const clpcid = urlParams.get('clpcid') || '';
    const source = urlParams.get('source') || '';
    const adId = urlParams.get('ad_id') || '';
    const campaignName = urlParams.get('campaign_name') || '';
    const adsetName = urlParams.get('adset_name') || '';
    const adName = urlParams.get('ad_name') || '';

    const isSuccessPage = document.getElementById('success-page') !== null;
    const isIndexPage = document.getElementById('quiz-container') !== null;

    const modal = document.getElementById('faq-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const helpIcon = document.querySelector('.header-icon');
    const faqItems = document.querySelectorAll('.faq-item');

    if (helpIcon) {
        helpIcon.style.cursor = 'pointer';
        helpIcon.addEventListener('click', () => modal.style.display = 'flex');
    }
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-icon').innerHTML = '&plus;';
            });
            if (!isActive) {
                item.classList.add('active');
                item.querySelector('.faq-icon').innerHTML = '&minus;';
            }
        });
    });

    if (isSuccessPage) {

        const network = urlParams.get('network') || 'mtn';

        const offersByNetwork = {
            'mtn': [
                'https://www.onetrax.pro/base2.php'
            ],
            'airtel': [
                'https://www.onetrax.pro/base2.php?cloid=1007'
            ],
            'glo': [
				'https://www.onetrax.pro/base2.php?cloid=1008'
            ]
        };

        const networkOffers = offersByNetwork[network] || offersByNetwork['mtn'];
        const randomOffer = networkOffers[Math.floor(Math.random() * networkOffers.length)];

        const successBtn = document.querySelector('.btn-cta');
        if (successBtn) {
            successBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const offerUrl = new URL(randomOffer);
                if (clpcid) offerUrl.searchParams.set('clpcid', clpcid);
                if (source) offerUrl.searchParams.set('source', source);
                if (adId) offerUrl.searchParams.set('ad_id', adId);
                if (campaignName) offerUrl.searchParams.set('campaign_name', campaignName);
                if (adsetName) offerUrl.searchParams.set('adset_name', adsetName);
                if (adName) offerUrl.searchParams.set('ad_name', adName);

                window.location.href = offerUrl.toString();
            });
        }
    }

    if (isIndexPage) {

        let selectedAnswer = '';
        let currentQuestionIndex = 0;
        const questions = document.querySelectorAll('.quiz-question');
        const totalQuestions = questions.length;
		
		const randomSpots = Math.floor(Math.random() * (24 - 11 + 1)) + 11;
		
        const messages = [
            "Saving answers from poll",
            `Only <strong>${randomSpots} spots</strong> remaining`,
            "Your spot is reserved for <strong>3 minutes</strong>"
        ];

        // DOM Elements
        const heroSection = document.querySelector('.hero-section');
        const quizSection = document.getElementById('quiz-container');
        const quizContent = document.getElementById('quiz-content');
        const loadingScreen = document.getElementById('loading-screen');
        const loadingMessages = document.getElementById('loading-messages');
        const startButtons = document.querySelectorAll('.btn-cta, .btn-cta2');

        // Modal Elements
        const modal = document.getElementById('faq-modal');
        const modalCloseBtn = document.querySelector('.modal-close');
        const helpIcon = document.querySelector('.header-icon');
        const faqItems = document.querySelectorAll('.faq-item');


        startButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                startQuiz();
            });
        });

        function startQuiz() {
            heroSection.style.display = 'none';
            quizSection.style.display = 'block';
            window.scrollTo(0, 0);
            showQuestion(0);
        }


        function showQuestion(index) {
            questions.forEach(q => q.style.display = 'none');
            if (questions[index]) {
                questions[index].style.display = 'block';
            }
        }


        quizContent.addEventListener('click', (e) => {
            const option = e.target.closest('.quiz-option');
            if (!option) return;

            option.classList.add('selected');

            // Capture answer if data-answer exists on this question
            if (option.dataset.answer) {
                selectedAnswer = option.dataset.answer;
            }

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < totalQuestions) {
                    showQuestion(currentQuestionIndex);
                } else {
                    showLoading();
                }
            }, 50);
        });


        function showLoading() {
            quizContent.style.display = 'none';
            loadingScreen.style.display = 'block';

            let msgIndex = 0;

            function showNextMessage() {
                if (msgIndex < messages.length) {
                    const p = document.createElement('p');
                    p.innerHTML = messages[msgIndex];
                    p.style.cssText = 'font-size: 1.1rem; color: #333; margin-bottom: 10px; animation: fadeIn 0.5s ease;';
                    loadingMessages.appendChild(p);
                    msgIndex++;
                    setTimeout(showNextMessage, 1500);
                } else {
                    showSuccess();
                }
            }

            showNextMessage();
        }

        function showSuccess() {
            const successUrl = new URL('success.html', window.location.href);
            successUrl.searchParams.set('clpcid', clpcid);
            successUrl.searchParams.set('source', source);
            successUrl.searchParams.set('ad_id', adId);
            successUrl.searchParams.set('campaign_name', campaignName);
            successUrl.searchParams.set('adset_name', adsetName);
            successUrl.searchParams.set('ad_name', adName);
            successUrl.searchParams.set('network', selectedAnswer || 'mtn');

            window.location.href = successUrl.toString();
        }
    }

});
