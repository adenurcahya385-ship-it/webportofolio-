// Navigasi mobile
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// Dark mode dan Light mode; pilihan tema disimpan di browser.
const themeToggle = document.getElementById('themeToggle');
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('ade-portfolio-theme') || 'light'; } catch (error) { /* storage may be disabled */ }
if (savedTheme === 'dark') document.body.classList.add('dark');
function updateThemeIcon() {
  themeToggle.innerHTML = document.body.classList.contains('dark')
    ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}
updateThemeIcon();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  try {
    localStorage.setItem('ade-portfolio-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  } catch (error) { /* theme still works for this session */ }
  updateThemeIcon();
});

// Animasi elemen ketika masuk ke area layar.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Tandai menu sesuai bagian yang sedang terlihat.
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

// Tombol kembali ke atas.
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 450));
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('year').textContent = new Date().getFullYear();

// Modal detail proyek.
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('.project-detail').forEach(button => {
  button.addEventListener('click', () => {
    modalTitle.textContent = button.dataset.title;
    modalDescription.textContent = button.dataset.description;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('modalClose').focus();
  });
});
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalDone').addEventListener('click', closeModal);
modal.addEventListener('click', event => {
  if (event.target.dataset.close === 'true') closeModal();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

// Form kontak menggunakan mailto agar dapat dipakai tanpa backend/server.
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent(`Pesan portofolio dari ${name}`);
  const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);
  document.getElementById('formStatus').textContent = 'Membuka aplikasi email Anda...';
  window.location.href = `mailto:adenurcahya385@gmail.com?subject=${subject}&body=${body}`;
});
