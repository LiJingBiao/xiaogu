const galleryGrid = document.querySelector('.gallery-grid');
for (const entry of window.orielScreenshots ?? []) {
  const button = document.createElement('button');
  button.className = 'gallery-item reveal';
  button.type = 'button';
  Object.assign(button.dataset, { category: entry.category, image: entry.image, title: entry.title, description: entry.description });
  const image = document.createElement('img');
  Object.assign(image, { src: entry.image, alt: entry.title, loading: 'lazy', width: entry.width, height: entry.height });
  const caption = document.createElement('span');
  caption.className = 'gallery-caption';
  const title = document.createElement('b');
  title.textContent = entry.title;
  const note = document.createElement('small');
  note.textContent = entry.sourceLabel ?? (entry.category === 'widget' ? '真实组件视图' : '真实界面 · 演示数据');
  caption.append(title, note);
  button.append(image, caption);
  galleryGrid?.append(button);
}

const yearNode = document.querySelector('#year');
if (yearNode) yearNode.textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const tabs = document.querySelectorAll('.gallery-tab');
const galleryItems = document.querySelectorAll('.gallery-item');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.classList.remove('is-active'));
  tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  tab.classList.add('is-active');
  const filter = tab.dataset.filter;
  galleryItems.forEach((item) => {
    const visible = filter === 'all' || item.dataset.category === filter;
    item.hidden = !visible;
  });
}));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('.lightbox-copy h3');
const lightboxDescription = document.querySelector('.lightbox-copy p');
let previousFocus;
const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  previousFocus?.focus();
};
const screenshotTriggers = [...galleryItems, ...document.querySelectorAll('[data-screenshot]')];
for (const trigger of document.querySelectorAll('[data-screenshot]')) {
  const entry = window.orielScreenshots.find((item) => item.image === trigger.dataset.screenshot);
  if (entry) Object.assign(trigger.dataset, { image: entry.image, title: entry.title, description: entry.description });
}
screenshotTriggers.forEach((item) => item.addEventListener('click', (event) => {
  if (!item.dataset.image) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  previousFocus = item;
  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.dataset.title;
  lightboxTitle.textContent = item.dataset.title;
  lightboxDescription.textContent = item.dataset.description;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.querySelector('.lightbox-panel').scrollTop = 0;
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}));
lightbox?.querySelectorAll('[data-lightbox-close]').forEach((element) => element.addEventListener('click', closeLightbox));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  if (event.key === 'Tab' && lightbox.classList.contains('is-open')) {
    event.preventDefault();
    lightbox.querySelector('.lightbox-close').focus();
  }
});
