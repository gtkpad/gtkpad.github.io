/* ========================================
   TRABALHO FUNDAMENTOS WEB
   Autor: Gabriel Vieira Pinto
   Arquivo: JavaScript Principal (sem frameworks)
   ======================================== */

"use strict"; // Modo estrito para evitar erros comuns

/* ========================================
   1. VARIÁVEIS GLOBAIS E SELETORES DOM
   ======================================== */

// Elementos do Menu Mobile
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav__link");

// Elementos do Toggle de Tema
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-toggle__icon");

// Elementos do Formulário
const contatoForm = document.getElementById("contatoForm");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const mensagemInput = document.getElementById("mensagem");
const formSuccess = document.getElementById("formSuccess");

// Elementos de Erro
const nomeError = document.getElementById("nomeError");
const emailError = document.getElementById("emailError");
const mensagemError = document.getElementById("mensagemError");

/* ========================================
   2. INICIALIZAÇÃO AO CARREGAR A PÁGINA
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initMenuMobile();
  initSmoothScroll();
  initFormValidation();

  console.log("✅ Portfólio carregado com sucesso!");
});

/* ========================================
   3. TEMA CLARO/ESCURO
   ======================================== */

/**
 * Inicializa o tema a partir do localStorage
 * Se não houver preferência salva, usa tema claro como padrão
 */
function initTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    updateThemeIcon("dark");
  } else {
    document.body.classList.remove("dark-theme");
    updateThemeIcon("light");
  }
}

/**
 * Alterna entre tema claro e escuro
 */
function toggleTheme() {
  document.body.classList.toggle("dark-theme");

  // Verifica qual tema está ativo e salva no localStorage
  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
    updateThemeIcon("dark");
  } else {
    localStorage.setItem("theme", "light");
    updateThemeIcon("light");
  }
}

/**
 * Atualiza o ícone do botão de tema
 * @param {string} theme - 'light' ou 'dark'
 */
function updateThemeIcon(theme) {
  if (theme === "dark") {
    themeIcon.textContent = "☀️";
  } else {
    themeIcon.textContent = "🌙";
  }
}

// Event listener para o botão de tema
if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

/* ========================================
   4. MENU MOBILE (HAMBÚRGUER)
   ======================================== */

/**
 * Inicializa funcionalidades do menu mobile
 */
function initMenuMobile() {
  // Toggle do menu ao clicar no botão hambúrguer
  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  // Fecha o menu ao clicar em qualquer link de navegação
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener("click", function (event) {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);

    if (
      !isClickInsideMenu &&
      !isClickOnToggle &&
      navMenu.classList.contains("active")
    ) {
      closeMenu();
    }
  });
}

/**
 * Alterna a visibilidade do menu mobile
 */
function toggleMenu() {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");

  // Adiciona aria-expanded para acessibilidade
  const isExpanded = navMenu.classList.contains("active");
  navToggle.setAttribute("aria-expanded", isExpanded);
}

/**
 * Fecha o menu mobile
 */
function closeMenu() {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
}

/* ========================================
   5. SMOOTH SCROLL PARA NAVEGAÇÃO
   ======================================== */

/**
 * Inicializa smooth scroll para links internos
 * Adiciona comportamento suave ao clicar em links âncora
 */
function initSmoothScroll() {
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Verifica se é um link âncora interno
      if (href.startsWith("#")) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Calcula a posição considerando o header fixo
          const headerHeight = document.querySelector(".header").offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight;

          // Scroll suave até a seção
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

/* ========================================
   6. VALIDAÇÃO DO FORMULÁRIO
   ======================================== */

/**
 * Inicializa validação do formulário de contato
 */
function initFormValidation() {
  if (contatoForm) {
    contatoForm.addEventListener("submit", handleFormSubmit);

    // Validação em tempo real nos campos
    nomeInput.addEventListener("blur", () =>
      validateField(nomeInput, validateNome)
    );
    emailInput.addEventListener("blur", () =>
      validateField(emailInput, validateEmail)
    );
    mensagemInput.addEventListener("blur", () =>
      validateField(mensagemInput, validateMensagem)
    );

    // Remove erro ao começar a digitar
    nomeInput.addEventListener("input", () => clearError(nomeInput, nomeError));
    emailInput.addEventListener("input", () =>
      clearError(emailInput, emailError)
    );
    mensagemInput.addEventListener("input", () =>
      clearError(mensagemInput, mensagemError)
    );
  }
}

/**
 * Manipula o envio do formulário
 * @param {Event} event - Evento de submit
 */
function handleFormSubmit(event) {
  event.preventDefault(); // Previne o envio padrão do formulário

  // Validação completa de todos os campos
  const isNomeValid = validateField(nomeInput, validateNome);
  const isEmailValid = validateField(emailInput, validateEmail);
  const isMensagemValid = validateField(mensagemInput, validateMensagem);

  // Se todos os campos forem válidos, simula o envio
  if (isNomeValid && isEmailValid && isMensagemValid) {
    simulateFormSubmit();
  } else {
    // Foca no primeiro campo com erro
    if (!isNomeValid) {
      nomeInput.focus();
    } else if (!isEmailValid) {
      emailInput.focus();
    } else if (!isMensagemValid) {
      mensagemInput.focus();
    }
  }
}

/**
 * Valida um campo específico
 * @param {HTMLElement} input - Campo de input
 * @param {Function} validationFn - Função de validação
 * @returns {boolean} - True se válido, false se inválido
 */
function validateField(input, validationFn) {
  const errorElement = document.getElementById(`${input.id}Error`);
  const errorMessage = validationFn(input.value.trim());

  if (errorMessage) {
    showError(input, errorElement, errorMessage);
    return false;
  } else {
    clearError(input, errorElement);
    return true;
  }
}

/**
 * Valida o campo Nome
 * @param {string} value - Valor do campo
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
function validateNome(value) {
  if (!value) {
    return "Por favor, preencha seu nome.";
  }

  if (value.length < 3) {
    return "O nome deve ter pelo menos 3 caracteres.";
  }

  // Verifica se contém apenas letras e espaços
  const nomeRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  if (!nomeRegex.test(value)) {
    return "O nome deve conter apenas letras.";
  }

  return null;
}

/**
 * Valida o campo Email
 * @param {string} value - Valor do campo
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
function validateEmail(value) {
  if (!value) {
    return "Por favor, preencha seu email.";
  }

  // Regex para validação de email (padrão RFC 5322 simplificado)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return "Por favor, insira um email válido (ex: usuario@exemplo.com).";
  }

  return null;
}

/**
 * Valida o campo Mensagem
 * @param {string} value - Valor do campo
 * @returns {string|null} - Mensagem de erro ou null se válido
 */
function validateMensagem(value) {
  if (!value) {
    return "Por favor, escreva uma mensagem.";
  }

  if (value.length < 10) {
    return "A mensagem deve ter pelo menos 10 caracteres.";
  }

  if (value.length > 1000) {
    return "A mensagem deve ter no máximo 1000 caracteres.";
  }

  return null;
}

/**
 * Exibe mensagem de erro em um campo
 * @param {HTMLElement} input - Campo de input
 * @param {HTMLElement} errorElement - Elemento de erro
 * @param {string} message - Mensagem de erro
 */
function showError(input, errorElement, message) {
  input.classList.add("error");
  errorElement.textContent = message;
  input.setAttribute("aria-invalid", "true");
}

/**
 * Remove mensagem de erro de um campo
 * @param {HTMLElement} input - Campo de input
 * @param {HTMLElement} errorElement - Elemento de erro
 */
function clearError(input, errorElement) {
  input.classList.remove("error");
  errorElement.textContent = "";
  input.setAttribute("aria-invalid", "false");
}

/**
 * Simula o envio do formulário
 * Exibe mensagem de sucesso e limpa os campos
 */
function simulateFormSubmit() {
  // Coleta os dados do formulário (para demonstração)
  const formData = {
    nome: nomeInput.value.trim(),
    email: emailInput.value.trim(),
    mensagem: mensagemInput.value.trim(),
    timestamp: new Date().toISOString(),
  };

  // Log dos dados (em produção, seria enviado para um servidor)
  console.log("📧 Formulário enviado com sucesso!");
  console.log("Dados:", formData);

  // Esconde o formulário
  contatoForm.style.display = "none";

  // Exibe mensagem de sucesso
  formSuccess.style.display = "block";

  // Limpa os campos do formulário
  contatoForm.reset();

  // Scroll suave até a mensagem de sucesso
  formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });

  // Após 5 segundos, mostra o formulário novamente
  setTimeout(function () {
    formSuccess.style.display = "none";
    contatoForm.style.display = "block";
  }, 5000);
}

/* ========================================
   7. FUNCIONALIDADES ADICIONAIS
   ======================================== */

/**
 * Atualiza o ano no footer automaticamente
 */
function updateFooterYear() {
  const footerText = document.querySelector(".footer__text");
  if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.innerHTML = footerText.innerHTML.replace(/\d{4}/, currentYear);
  }
}

// Executa ao carregar a página
updateFooterYear();

/**
 * Destaca o link de navegação ativo baseado na seção visível
 */
function highlightActiveNavLink() {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav__link");

  window.addEventListener("scroll", function () {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollPosition = window.pageYOffset + 100;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    // Remove classe 'active' de todos os links e adiciona ao link atual
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
}

// Inicializa destacar link ativo
highlightActiveNavLink();

/* ========================================
   8. TRATAMENTO DE ERROS GLOBAL
   ======================================== */

/**
 * Captura erros não tratados para debugging
 */
window.addEventListener("error", function (event) {
  console.error("❌ Erro capturado:", event.error);
});

/**
 * Captura promessas rejeitadas não tratadas
 */
window.addEventListener("unhandledrejection", function (event) {
  console.error("❌ Promise rejeitada:", event.reason);
});

/* ========================================
   9. PERFORMANCE E OTIMIZAÇÕES
   ======================================== */

/**
 * Debounce: Limita a frequência de execução de uma função
 * Útil para eventos que disparam muitas vezes (resize, scroll)
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} - Função com debounce aplicado
 */
function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Otimiza eventos de resize
 */
const handleResize = debounce(function () {
  console.log("🔄 Janela redimensionada");
  // Aqui você pode adicionar lógica adicional ao redimensionar
}, 300);

window.addEventListener("resize", handleResize);

/* ========================================
   10. UTILITIES E HELPERS
   ======================================== */

/**
 * Verifica se um elemento está visível no viewport
 * @param {HTMLElement} element - Elemento a ser verificado
 * @returns {boolean} - True se visível, false se não
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Sanitiza string para prevenir XSS (básico)
 * @param {string} str - String a ser sanitizada
 * @returns {string} - String sanitizada
 */
function sanitizeString(str) {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}

/* ========================================
   FIM DO SCRIPT
   ======================================== */

console.log("🚀 JavaScript carregado e pronto!");
