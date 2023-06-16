//@Key svvvvip nettest  2023-06-15 12:34:11
Promise.all([
  (async () => {
    try {
      let e = "",
        t = "",
        s = "",
        i = "",
        l = "";
      let n,
        r = $network,
        a = r.dns;
      let o = "";
      let c = (r["cellular-data"] && r["cellular-data"].radio) || "";
      let p = r.v4.primaryAddress;
      let u = r.v6.primaryAddress !== null ? ": IPv6:" : "";
      let d = r.wifi.ssid !== null ? "WiFi: " : "";
      const f = await tKey(
        `http://connectivitycheck.platform.hicloud.com`,
        500
      );
      if (d !== "") {
        for (let e = 0; e < a.length; e++) {
          if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(a[e])) {
            o = a[e];
            break;
          }
        }
        n = "内网: " + d + u + " " + p + ", " + f.tk + "ms\n";
      } else {
        n = "内网: " + c + u + " " + p + ", " + f.tk + "ms\n";
      }
      const m = await tKey(
        "https://api.live.bilibili.com/ip_service/v1/ip_service/get_ip_addr",
        500
      );
      if (m.code === 0) {
        let { addr: e, province: s, city: i, isp: l } = m.data,
          n = m.tk;
        l = l.replace(/.*广电.*/g, "广电");
        t = "本机: " + s + l + ": " + e + ", " + n + "ms\n";
      } else {
        t = "Biliapi " + m + "\n";
      }
      const y = await tKey("http://chat.openai.com/cdn-cgi/trace", 1e3);
      const h = ["CN", "TW", "HK", "IR", "KP", "RU", "VE", "BY"];
      if (typeof y !== "string") {
        let { loc: e, tk: t, warp: i, ip: l } = y,
          n = h.indexOf(e),
          r = "";
        if (n == -1) {
          r = "GPT: " + e + " ✓";
        } else {
          r = "GPT: " + e + " ×";
        }
        if ((i = "plus")) {
          i = "Plus";
        }
        s = r + "       ➟     Priv: " + i + "   " + t + "ms";
      } else {
        s = "ChatGPT " + y;
      }
      const w = await tKey("http://ip-api.com/json/?lang=zh-CN", 3e3);
      let g = new Date();
      let P =
        ", " +
        (g.getMonth() + 1) +
        "月" +
        g.getDate() +
        " " +
        g.getHours() +
        ":" +
        g.getMinutes();
      if (w.status === "success") {
        let {
          country: t,
          countryCode: s,
          query: l,
          city: n,
          org: r,
          as: a,
          tk: o
        } = w;
        e = l;
        ast = sK(a, 3);
        a = sK(a, 2);
        r = sK(r, 1);
        let c = a.split(" ")[1];
        let p = "";
        if (c.toLowerCase() === r.toLowerCase()) {
          p = ast;
        } else {
          p = a + " " + r;
        }
        i = t + " " + s + ": " + l + ", " + o + "ms\n" + p;
      } else {
        i = w + "\n";
      }
      const v = await httpAPI();
      let K,
        k = v.requests
          .filter(
            (e) =>
              /\(Proxy\)/.test(e.remoteAddress) && /ip-api\.com/.test(e.URL)
          )
          .map((e) => e.remoteAddress.replace(" (Proxy)", ""));
      if (k.length > 0) {
        K = k[0];
      } else {
        K = "Noip";
      }
      let $ = false,
        A = "spe",
        C = false,
        z = "edtest";
      (isv6 = false), (cn = true), (zl = "");
      if (K == e) {
        cn = false;
        zl = "直连: ";
      } else {
        zl = "落地: ";
      }
      if (K === "Noip") {
        $ = true;
      } else if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(K)) {
        C = true;
      } else if (/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(K)) {
        isv6 = true;
      }
      if (cn) {
        if (!$ || C) {
          const e = await tKey(`https://api-v3.${A}${z}.cn/ip?ip=${K}`, 500);
          if (e.code === 0) {
            let { province: t, isp: s, city: i } = e.data,
              n = e.tk;
            s = sK(s, 4);
            l = "入口: " + i + s + ": " + K + ", " + n + "ms\n";
          } else {
            l = "入口IPA" + e + "\n";
          }
        } else if (!$ || isv6) {
          const e = await tKey(`http://ip-api.com/json/${K}?lang=zh-CN`, 1e3);
          if (e.status === "success") {
            let { country: t, city: s, org: i, tk: n } = e;
            l = "入口: " + s + i + ": " + K + ", " + n + "ms\n";
          } else {
            l = "入口IPB" + e + "\n";
          }
        }
      }
      $done({ title: s, content: n + t + l + zl + i + P });
    } catch (e) {
      $done({
        title: outgpt,
        content: local + outbli + outik + outld + zl + day
      });
    }
  })()
]);
function smKey(e, t) {
  if (e.length > t) {
    return e.slice(0, t);
  } else if (e.length < t) {
    return e.toString().padEnd(t, " ");
  } else {
    return e;
  }
}
function sK(e, t) {
  return e
    .split(" ", t)
    .join(" ")
    .replace(/\.|\,|com|\u4e2d\u56fd/g, "");
}
async function httpAPI(e = "/v1/requests/recent", t = "GET", s = null) {
  return new Promise((i, l) => {
    $httpAPI(t, e, s, (e) => {
      i(e);
    });
  });
}
async function tKey(e, t) {
  let s = 1,
    i = 1;
  const l = new Promise((l, r) => {
    const a = async (o) => {
      try {
        const s = await Promise.race([
          new Promise((t, s) => {
            let i = Date.now();
            $httpClient.get({ url: e }, (e, l, n) => {
              if (e) {
                s(e);
              } else {
                if (/^\s*[\{]/.test(n)) {
                  let e = JSON.parse(n);
                  e.tk = Date.now() - i;
                  t(e);
                } else {
                  let e = n.split("\n");
                  let s = e.reduce((e, t) => {
                    let [s, l] = t.split("=");
                    e[s] = l;
                    e.tk = Date.now() - i;
                    return e;
                  }, {});
                  t(s);
                }
              }
            });
          }),
          new Promise((e, s) => {
            setTimeout(() => s(new Error("timeout")), t);
          })
        ]);
        if (s) {
          l(s);
        } else {
          r(new Error(n.message));
        }
      } catch (e) {
        if (o < s) {
          i++;
          a(o + 1);
        } else {
          l("检测失败, 重试次数" + i);
        }
      }
    };
    a(0);
  });
  return l;
}
