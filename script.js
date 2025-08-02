// المتغيرات العامة
let messageHistory = [];
let isTyping = false;

// عناصر DOM
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
let welcomeScreen = document.getElementById('welcomeScreen');

// تحديث حجم منطقة النص تلقائياً
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    
    // تفعيل/إلغاء تفعيل زر الإرسال
    sendBtn.disabled = !this.value.trim();
});

// إرسال الرسالة عند الضغط على Enter (Shift+Enter للسطر الجديد)
messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

/**
 * إخفاء شاشة الترحيب
 */
function hideWelcomeScreen() {
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
}

/**
 * إضافة رسالة جديدة للمحادثة
 * @param {string} content - محتوى الرسالة
 * @param {boolean} isUser - هل الرسالة من المستخدم أم المساعد
 */
function addMessage(content, isUser = false) {
    hideWelcomeScreen();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
    
    messageDiv.innerHTML = `
        <div class="avatar">${isUser ? 'أ' : 'ذ'}</div>
        <div class="message-content">${content}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // حفظ الرسالة في التاريخ
    messageHistory.push({
        content: content,
        isUser: isUser,
        timestamp: new Date()
    });
}

/**
 * إضافة مؤشر الكتابة
 */
function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="avatar">ذ</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

/**
 * إزالة مؤشر الكتابة
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * التمرير إلى أسفل المحادثة
 */
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * إرسال رسالة جديدة
 */
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;
    
    // إضافة رسالة المستخدم
    addMessage(message, true);
    
    // مسح مربع الإدخال
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    
    // عرض مؤشر الكتابة
    isTyping = true;
    addTypingIndicator();
    
    // محاكاة رد المساعد الذكي
    setTimeout(() => {
        removeTypingIndicator();
        
        // توليد رد متناسب مع السياق
        const response = generateResponse(message);
        addMessage(response);
        
        isTyping = false;
    }, 1000 + Math.random() * 2000); // تأخير عشوائي بين 1-3 ثواني
}

/**
 * إرسال اقتراح محدد
 * @param {string} suggestion - النص المقترح
 */
function sendSuggestion(suggestion) {
    messageInput.value = suggestion;
    sendMessage();
}

/**
 * توليد رد تلقائي بناءً على رسالة المستخدم
 * @param {string} userMessage - رسالة المستخدم
 * @returns {string} رد المساعد
 */
function generateResponse(userMessage) {
    const responses = [
        "هل تود معرفة المزيد عن التفاعلات الكيميائية أو تركيب المركبات؟ يمكنني شرحها بطريقة مبسطة.",
        "هل تريد شرح قوانين الحركة والطاقة في الفيزياء بطريقة واضحة وسهلة؟",
        "هل تحتاج مساعدة في حل مسائل رياضية مثل المعادلات أو التفاضل والتكامل؟ سأرشدك خطوة بخطوة.",
        "هل تود فهم تركيب الخلية أو وظائف أنظمة الجسم المختلفة في الأحياء بشكل مبسط؟",
        "أخبرني أكثر عن الموضوع الذي تريد استكشافه في الكيمياء، الفيزياء، الرياضيات، أو الأحياء، لأساعدك بشكل أفضل.",
        "أنا هنا لمساعدتك في شرح المفاهيم الأساسية لأي من هذه المواد بطريقة مفصلة وواضحة."
    ];
    
    // ردود بسيطة معتمدة على الكلمات المفتاحية للعرض التوضيحي
    const lowerMessage = userMessage.toLowerCase();

if (lowerMessage.includes('تفاعل') || lowerMessage.includes('ذرة') || lowerMessage.includes('مركب')) {
    return "في الكيمياء، التفاعلات والمركبات هي أساس الفهم. هل تود معرفة المزيد عن تركيب الذرة أو كيفية حدوث التفاعلات الكيميائية؟";
}

if (lowerMessage.includes('قوة') || lowerMessage.includes('حركة') || lowerMessage.includes('طاقة')) {
    return "الفيزياء تشرح القوى والحركة والطاقة بطريقة منهجية. هل تريد شرح قوانين الحركة أو فهم كيفية انتقال الطاقة؟";
}

if (lowerMessage.includes('مسألة') || lowerMessage.includes('معادلة') || lowerMessage.includes('حساب')) {
    return "الرياضيات تساعدنا على حل المسائل والمعادلات بدقة. هل تحتاج مساعدة في التفاضل، التكامل، أو حل معادلات معينة؟";
}

if (lowerMessage.includes('خلية') || lowerMessage.includes('جسم') || lowerMessage.includes('نظام')) {
    return "الأحياء تركز على دراسة الخلايا وأنظمة الجسم المختلفة. هل تريد شرح تركيب الخلية أو وظيفة الأعضاء الحيوية؟";
}

// الرد الافتراضي
return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * مسح المحادثة وإعادة تعيين الواجهة
 */
function clearChat() {
    messagesContainer.innerHTML = `
        <div class="welcome-screen" id="welcomeScreen">
                <h1 class="welcome-title">أسأل, تعلّم, تطوّر معًا في مُعلِّمي</h1>
                <p class="welcome-subtitle">اسألني عن أي شيء أو حدد المادة من الخيارات: </p>
                
                <div class="suggestions">
    <div class="suggestion-card" onclick="sendSuggestion('اشرح لي التفاعلات الكيميائية الأساسية مثل الأحماض والقواعد بطريقة مبسطة')">
        <div class="suggestion-title">مادة الكيمياء</div>
        <div class="suggestion-desc">فهم التفاعلات الكيميائية والروابط والمركبات بطريقة مبسطة وسلسة</div>
    </div>
    <div class="suggestion-card" onclick="sendSuggestion('اشرح لي قوانين الحركة والقوى الأساسية في الفيزياء بطريقة سهلة')">
        <div class="suggestion-title">مادة الفيزياء</div>
        <div class="suggestion-desc">تبسيط المفاهيم الفيزيائية مثل الحركة، القوى، والطاقة بطريقة واقعية وعملية</div>
    </div>
    <div class="suggestion-card" onclick="sendSuggestion('ساعدني في حل مسائل التفاضل والتكامل خطوة بخطوة')">
        <div class="suggestion-title">مادة الرياضيات</div>
        <div class="suggestion-desc">شرح القوانين والمسائل الرياضية بطريقة منطقية وتدريجية تسهل الفهم والتطبيق</div>
    </div>
    <div class="suggestion-card" onclick="sendSuggestion('اشرح لي تركيب الخلية ووظائف أعضائها بشكل مبسط')">
        <div class="suggestion-title">مادة الأحياء</div>
        <div class="suggestion-desc">فهم مكونات الكائنات الحية وأنظمتها الحيوية بشكل مبسط وعلمي</div>
                    </div>
                </div>
            </div>
    `;
    
    // إعادة ربط شاشة الترحيب
    welcomeScreen = document.getElementById('welcomeScreen');
    
    // إعادة تعيين البيانات
    messageHistory = [];
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    isTyping = false;
}

/**
 * التهيئة الأولية عند تحميل الصفحة
 */
document.addEventListener('DOMContentLoaded', function() {
    // تعطيل زر الإرسال في البداية
    sendBtn.disabled = true;
    
    // التركيز على مربع الإدخال
    messageInput.focus();
});

function exportChat() {
    alert("زر التصدير تم النقر عليه (لم يُفعّل بعد)");
}

function recordAudio() {
    alert("زر التسجيل الصوتي تم النقر عليه (لم يُفعّل بعد)");
}

// متغير لتتبع حالة الشريط الجانبي
let sidebarVisible = true;

/**
 * تبديل إظهار/إخفاء الشريط الجانبي
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainLayout = document.querySelector('.main-layout');
    const inputContainer = document.querySelector('.input-container');
    
    if (sidebarVisible) {
        // إخفاء الشريط الجانبي
        sidebar.style.transform = 'translateX(-100%)';
        inputContainer.style.left = '0';
        sidebarVisible = false;
    } else {
        // إظهار الشريط الجانبي
        sidebar.style.transform = 'translateX(0)';
        inputContainer.style.left = '250px';
        sidebarVisible = true;
    }
}