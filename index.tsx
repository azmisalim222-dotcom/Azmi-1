import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to mount application:", error);
  container.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; color: red; flex-direction: column; text-align: center;">
      <h1>عذراً، حدث خطأ أثناء تشغيل التطبيق</h1>
      <p>يرجى التحقق من وحدة التحكم (Console) لمزيد من التفاصيل.</p>
    </div>
  `;
}