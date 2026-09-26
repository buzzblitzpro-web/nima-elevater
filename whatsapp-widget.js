/**
 * Nima Elevator - WhatsApp Deep Link & Quick Action Controller
 * Supports standard wa.me, native mobile deep linking, prefilled custom messages,
 * dynamic configuration extraction, and popup-blocker proof navigation.
 */

const NIMA_WHATSAPP_CONFIG = {
  phoneNumber: "919562835050", // +91 95628 35050
  displayPhone: "+91 95628 35050",
  businessName: "Nima Elevator Technologies (Kerala)",
  defaultMessage: "Hello Nima Elevator, I would like to inquire about elevator solutions for my Kerala project.",
  quickInquiries: [
    {
      id: "quote",
      icon: "request_quote",
      title: "Instant Kerala Lift Quote",
      desc: "Get fast pricing & site feasibility in ₹ Lakhs",
      msg: "Hello Nima Elevator team, I would like to request an instant price estimate and feasibility consultation for a new lift installation in Kerala."
    },
    {
      id: "cad",
      icon: "architecture",
      title: "Architectural & CAD Specs",
      desc: "Shaft drawings, BIS IS 14665 & BIM models",
      msg: "Hi Nima Engineering, please share architectural CAD hoistway specifications, BIS IS 14665 compliance details, and BIM layout files."
    },
    {
      id: "maintenance",
      icon: "build_circle",
      title: "Kerala AMC & Maintenance",
      desc: "24/7 contracts & preventive health checks",
      msg: "Hello, I am interested in your Kerala Annual Maintenance Contracts (AMC) and 24/7 breakdown dispatch service."
    },
    {
      id: "emergency",
      icon: "e911_emergency",
      title: "24/7 Emergency Dispatch",
      desc: "Priority breakdown & rescue across Kerala",
      msg: "URGENT: Requesting immediate elevator breakdown assistance & emergency technician dispatch in Kerala."
    }
  ]
};

// Build Universal Deep Link URL
function getWhatsAppDeepLink(customMessage, phone) {
  let targetPhone = (phone || NIMA_WHATSAPP_CONFIG.phoneNumber).toString().replace(/[^0-9]/g, '');
  if (targetPhone.startsWith('0')) {
    targetPhone = targetPhone.replace(/^0+/, '');
  }
  if (targetPhone.length === 10) {
    targetPhone = '91' + targetPhone;
  }
  const text = (customMessage !== undefined && customMessage !== null && customMessage.toString().trim() !== '') 
    ? customMessage.toString().trim() 
    : NIMA_WHATSAPP_CONFIG.defaultMessage;
  const encodedMsg = encodeURIComponent(text);
  return `https://wa.me/${targetPhone}?text=${encodedMsg}`;
}

// Popup-blocker-proof Open Helper
function openWhatsAppChat(customMessage, phone) {
  const url = getWhatsAppDeepLink(customMessage, phone);
  
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    } else {
      win.focus();
    }
  } catch (err) {
    window.location.href = url;
  }
}

// Global Exports immediately available
window.NIMA_WHATSAPP_CONFIG = NIMA_WHATSAPP_CONFIG;
window.getWhatsAppDeepLink = getWhatsAppDeepLink;
window.openWhatsAppChat = openWhatsAppChat;

// Global Template Trigger
window.triggerWhatsAppTemplate = function(templateId) {
  const item = NIMA_WHATSAPP_CONFIG.quickInquiries.find(t => t.id === templateId);
  if (item) {
    openWhatsAppChat(item.msg);
  } else {
    openWhatsAppChat(NIMA_WHATSAPP_CONFIG.defaultMessage);
  }
};

// Direct Product Inquiry Helper
window.inquireProductOnWhatsApp = function(productName, capacity, speed) {
  let msg = `Hi Nima Elevator, I would like to inquire about the *${productName}*.`;
  if (capacity) msg += ` Capacity: ${capacity}.`;
  if (speed) msg += ` Speed: ${speed}.`;
  msg += ` Please share availability, technical brochure, and price quotation.`;
  openWhatsAppChat(msg);
};

// Interactive Lift Configurator to WhatsApp
window.sendConfigurationToWhatsApp = function(building, capacity, speed, model, shaft) {
  const msg = `*Nima Elevator - Custom Lift Configuration Inquiry*\n` +
              `🏢 Building Type: ${building}\n` +
              `👥 Passenger Capacity: ${capacity}\n` +
              `⚡ Hoist Velocity: ${speed}\n` +
              `⚙️ Recommended Model: ${model || 'Standard'}\n` +
              `📐 Estimated Shaft: ${shaft || 'Custom'}\n\n` +
              `Please provide architectural shaft drawings, CAD feasibility review, and estimated quotation for this project.`;
  openWhatsAppChat(msg);
};

// Contact / Quote Form Submit to WhatsApp
window.sendQuoteFormToWhatsApp = function(formData) {
  let msg = `*Nima Elevator - New Project Quote Request*\n`;
  if (formData.projectType) msg += `🏢 Project: ${formData.projectType}\n`;
  if (formData.liftType) msg += `⚙️ Lift Model: ${formData.liftType}\n`;
  if (formData.floors) msg += `📶 Floors/Stops: ${formData.floors}\n`;
  if (formData.capacity) msg += `👥 Capacity / Finish: ${formData.capacity}\n`;
  if (formData.speed) msg += `⚡ Speed: ${formData.speed}\n`;
  if (formData.name) msg += `👤 Client Name: ${formData.name}\n`;
  if (formData.phone) msg += `📞 Contact: ${formData.phone}\n`;
  if (formData.location) msg += `📍 Project Location: ${formData.location}\n`;
  if (formData.notes) msg += `📝 Notes / Specs: ${formData.notes}\n`;

  openWhatsAppChat(msg);
};

// Create and Inject Floating WhatsApp Widget
function initWhatsAppWidget() {
  if (document.getElementById('nima-whatsapp-widget')) return;

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'nima-whatsapp-widget';
  widgetContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col items-end font-body-md';

  widgetContainer.innerHTML = `
    <!-- WhatsApp Popover Window -->
    <div id="wa-popover" class="hidden w-[360px] max-w-[calc(100vw-2rem)] mb-4 bg-surface-container-low border border-outline-variant/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl transition-all duration-300 origin-bottom-right scale-95 opacity-0">
      <!-- Popover Header -->
      <div class="bg-gradient-to-r from-[#0d2e24] via-[#103d30] to-surface-container-high p-4 border-b border-[#25D366]/20 relative">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center text-[#25D366]">
                <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.088.072.191.014.306-.058.115-.087.19-.173.289l-.26.302c-.087.089-.18.187-.077.362.102.175.457.755.98 1.221.674.601 1.242.787 1.417.874.175.087.278.073.382-.045.106-.118.452-.524.573-.705.12-.181.24-.151.405-.089.166.062 1.054.497 1.235.587.181.089.303.134.346.21.043.076.043.441-.101.846z"/>
                </svg>
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-surface-container-low rounded-full animate-pulse"></span>
            </div>
            <div>
              <h3 class="font-headline-sm text-body-md font-bold text-on-surface flex items-center gap-1.5">
                Nima WhatsApp Desk
              </h3>
              <p class="text-xs text-[#25D366] font-medium flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span> +91 95628 35050 • Online
              </p>
            </div>
          </div>
          <button id="close-wa-popover" class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-highest transition-colors" aria-label="Close WhatsApp chat">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      <!-- Quick Inquiry Templates (Native Links) -->
      <div class="p-3 bg-surface-container max-h-[220px] overflow-y-auto space-y-2 border-b border-outline-variant/30">
        <p class="text-[11px] font-label-caps uppercase tracking-wider text-on-surface-variant px-1">Choose Quick Action</p>
        <div class="grid grid-cols-1 gap-1.5" id="wa-template-list">
          ${NIMA_WHATSAPP_CONFIG.quickInquiries.map(item => `
            <a href="${getWhatsAppDeepLink(item.msg)}" target="_blank" rel="noopener noreferrer" class="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 hover:border-[#25D366]/40 transition-all flex items-start gap-2.5 group">
              <span class="material-symbols-outlined text-[20px] text-tertiary group-hover:text-[#25D366] transition-colors shrink-0 mt-0.5">${item.icon}</span>
              <div class="flex flex-col flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="font-headline-sm text-xs font-semibold text-on-surface group-hover:text-tertiary transition-colors">${item.title}</span>
                  <span class="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </div>
                <span class="text-[11px] text-on-surface-variant truncate">${item.desc}</span>
              </div>
            </a>
          `).join('')}
        </div>
      </div>

      <!-- Custom Message & Send -->
      <div class="p-3 bg-surface-container-low flex flex-col gap-2">
        <div class="relative">
          <textarea id="wa-custom-input" rows="2" placeholder="Type your elevator inquiry or requirement..." class="w-full bg-surface-container text-xs text-on-surface placeholder:text-on-surface-variant/70 p-2.5 rounded-xl border border-outline-variant/40 focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] outline-none resize-none transition-all"></textarea>
        </div>
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-label-code text-on-surface-variant">+91 95628 35050 Direct Encrypted Chat</span>
          <button id="wa-send-custom-btn" class="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-[#0b1f14] font-headline-sm text-xs font-bold rounded-lg shadow-md hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all flex items-center gap-1.5 shrink-0">
            <span>Send</span>
            <span class="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Toggle Button -->
    <div class="flex items-center gap-2">
      <button id="wa-toggle-btn" class="relative group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-[#0b1f14] rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300" aria-label="Open WhatsApp Chat">
        <!-- Glow Ring -->
        <span class="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none"></span>
        
        <!-- WhatsApp Icon -->
        <svg class="w-6 h-6 fill-current text-[#0b1f14]" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.088.072.191.014.306-.058.115-.087.19-.173.289l-.26.302c-.087.089-.18.187-.077.362.102.175.457.755.98 1.221.674.601 1.242.787 1.417.874.175.087.278.073.382-.045.106-.118.452-.524.573-.705.12-.181.24-.151.405-.089.166.062 1.054.497 1.235.587.181.089.303.134.346.21.043.076.043.441-.101.846z"/>
        </svg>
        
        <span class="font-headline-sm text-body-sm font-bold text-[#0b1f14] tracking-tight pr-0.5">Chat on WhatsApp</span>
      </button>
    </div>
  `;

  document.body.appendChild(widgetContainer);

  const popover = document.getElementById('wa-popover');
  const toggleBtn = document.getElementById('wa-toggle-btn');
  const closeBtn = document.getElementById('close-wa-popover');
  const customInput = document.getElementById('wa-custom-input');
  const sendCustomBtn = document.getElementById('wa-send-custom-btn');

  function openPopover() {
    popover.classList.remove('hidden');
    requestAnimationFrame(() => {
      popover.classList.remove('scale-95', 'opacity-0');
      popover.classList.add('scale-100', 'opacity-100');
    });
  }

  function closePopover() {
    popover.classList.remove('scale-100', 'opacity-100');
    popover.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      popover.classList.add('hidden');
    }, 200);
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (popover.classList.contains('hidden')) {
      openPopover();
    } else {
      closePopover();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closePopover();
  });

  sendCustomBtn.addEventListener('click', () => {
    const text = customInput.value.trim() || NIMA_WHATSAPP_CONFIG.defaultMessage;
    openWhatsAppChat(text);
  });

  customInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCustomBtn.click();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!widgetContainer.contains(e.target) && !popover.classList.contains('hidden')) {
      closePopover();
    }
  });
}

// Automatic initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhatsAppWidget);
} else {
  initWhatsAppWidget();
}
