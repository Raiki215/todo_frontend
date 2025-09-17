self.addEventListener("push", function (event) {
  const data = event.data.json();
  const title = data.title || "通知";
  const options = {
    body: data.body,
    icon: "/icon.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
