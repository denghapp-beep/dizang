/* 聯絡頁：表單送到作者的 Google 表單（同時寄 Email 通知並存入試算表）。 */
(() => {
  'use strict';
  const I = window.I18N || {t: z => z};
  const L = (z, e, v, j, k) => I.t(z, e, v, j, k);
  const root = document.getElementById('contact-app'); if (!root) return;
  const ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSf6UBBQDjbbcKG1U_ktjGl27C6hY8lENZlS9d9FtYgwsa3-kg/formResponse';
  const F = {name: 'entry.1585716869', email: 'entry.280547504', msg: 'entry.934148006'};
  const mail = ['denghapp', 'gmail.com'].join('@');  // 分開組合，減少爬蟲抓取
  root.innerHTML = `
    <div class="section-top"><div><span class="eyebrow">${L('聯 絡 · CONTACT', 'CONTACT', 'LIÊN HỆ', 'お 問 い 合 わ せ', '연 락')}</span>
      <h2>${L('聯絡與建議', 'Contact & Suggestions', 'Liên hệ & góp ý', 'お問い合わせ・ご意見', '연락과 제안')}</h2></div>
      <p>${L('對文集有任何建議、指正、感想或投稿，都歡迎留言。每一則都會由我本人親自閱讀。', 'Suggestions, corrections, reflections or submissions are all welcome. Every message is read by me personally.', 'Mọi góp ý, chỉnh sửa, cảm nhận hay bài gửi đều được hoan nghênh. Mỗi lời nhắn đều do chính tôi đọc.', 'ご意見・ご指摘・ご感想・ご投稿を歓迎します。いただいたメッセージはすべて私自身が拝読します。', '문집에 대한 제안, 바로잡을 점, 소감이나 투고 모두 환영합니다. 모든 메시지는 제가 직접 읽습니다.')}</p></div>
    <form class="contact-form" novalidate>
      <label>${L('稱呼（選填）', 'Name (optional)', 'Tên gọi (không bắt buộc)', 'お名前（任意）', '이름 (선택)')}<input name="name" maxlength="80" autocomplete="name"></label>
      <label>${L('Email（選填，需要回覆時請留下）', 'Email (optional — leave it if you would like a reply)', 'Email (không bắt buộc, để lại nếu muốn được hồi âm)', 'メール（任意・返信をご希望の場合）', '이메일 (선택, 답장을 원하시면 남겨 주세요)')}<input name="email" type="email" maxlength="120" autocomplete="email"></label>
      <label><span>${L('留言內容', 'Message', 'Nội dung', 'メッセージ', '메시지')} <b aria-hidden="true">*</b></span><textarea name="msg" rows="7" required maxlength="5000"></textarea></label>
      <input name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button type="submit">${L('送出', 'Send', 'Gửi', '送信', '보내기')}</button>
      <p class="contact-status" role="status" aria-live="polite"></p>
    </form>
    <p class="contact-alt">${L('也可以直接寫信：', 'Or write directly: ', 'Hoặc viết thư trực tiếp: ', 'メールでも受け付けています：', '이메일로도 연락하실 수 있습니다: ')}<a href="mailto:${mail}">${mail}</a></p>
    <p class="small contact-note">${L('留言只會傳給本站作者，不會公開。可以用任何語言書寫。', 'Messages go only to the site’s author and are never published. Any language is welcome.', 'Lời nhắn chỉ gửi đến tác giả, không công khai. Có thể viết bằng bất kỳ ngôn ngữ nào.', 'メッセージは作者にのみ届き、公開されません。どの言語でもかまいません。', '메시지는 작성자에게만 전달되며 공개되지 않습니다. 어떤 언어로 쓰셔도 됩니다.')}</p>`;
  const form = root.querySelector('form'), st = root.querySelector('.contact-status'), btn = form.querySelector('button');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.website.value) return;  // 機器人陷阱
    const msg = form.msg.value.trim();
    if (!msg) { st.textContent = L('請先寫下留言內容。', 'Please write a message first.', 'Vui lòng viết nội dung trước.', 'メッセージをご記入ください。', '메시지를 먼저 적어 주세요.'); form.msg.focus(); return; }
    btn.disabled = true; st.textContent = L('傳送中……', 'Sending…', 'Đang gửi…', '送信中…', '보내는 중…');
    const body = new URLSearchParams({[F.name]: form.name.value.trim(), [F.email]: form.email.value.trim(), [F.msg]: msg + '\n\n[' + (I.lang || 'zh') + '] ' + location.href});
    try {
      await fetch(ACTION, {method: 'POST', mode: 'no-cors', body});
      form.reset(); st.textContent = L('已收到，感恩您的留言。🙏', 'Received — thank you for your message. 🙏', 'Đã nhận, xin cảm ơn lời nhắn của bạn. 🙏', '受け付けました。ありがとうございます。🙏', '잘 받았습니다. 감사합니다. 🙏');
    } catch { st.innerHTML = L('送出失敗，請改用 Email：', 'Could not send. Please email: ', 'Gửi không thành công, vui lòng gửi email: ', '送信できませんでした。メールでお送りください：', '보내지 못했습니다. 이메일로 보내 주세요: ') + `<a href="mailto:${mail}">${mail}</a>`; }
    btn.disabled = false;
  });
})();
