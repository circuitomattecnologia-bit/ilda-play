/*
ATUALIZAÇÃO RÁPIDA DO ILDA PLAY
Troque somente os links entre aspas e salve o arquivo.

Aceita:
- Spotify: link normal de playlist.
- POD SGP e Vídeos Oficiais: vídeo ou playlist do YouTube.
- Rádio Ilda: vídeo/playlist do YouTube ou arquivo de áudio direto (.mp3).
*/

const CONTEUDOS = {
  spotify: "https://open.spotify.com/playlist/37i9dQZF1DX8AliSIsGeKd?si=8a9ff1a7d1b040f4",
  podSgp: "https://youtu.be/t8DMQRPdI_w?si=GvIzR5ioKRcofL-0",
  videosOficiais: "https://drive.google.com/drive/folders/1GPHn9uvMpJM_9kOAsDRVAZtR8o1IG9Zj?usp=sharing",
  radioIlda: ""
};

function spotifyEmbed(url) {
  const match = String(url).match(/playlist\/([A-Za-z0-9]+)/);
  return match ? `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator` : "";
}

function youtubeEmbed(url) {
  const value = String(url || "").trim();
  if (!value) return "";

  try {
    const u = new URL(value);
    const list = u.searchParams.get("list");
    if (list) return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`;

    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }

    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;

    const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
  } catch (_) {}
  return "";
}

function placeholder(text) {
  return `<div class="content-placeholder">${text}</div>`;
}

function renderSpotify() {
  const host = document.getElementById("spotify-content");
  const embed = spotifyEmbed(CONTEUDOS.spotify);
  if (!embed) {
    host.innerHTML = placeholder("Playlist em preparação.");
    return;
  }
  host.innerHTML = `
    <iframe class="content-player" style="height:352px" src="${embed}"
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
    <a class="content-link" href="${CONTEUDOS.spotify}" target="_blank" rel="noopener noreferrer">🎵 Abrir no Spotify</a>`;
}

function renderYoutube(targetId, url, emptyText, buttonText) {
  const host = document.getElementById(targetId);
  const embed = youtubeEmbed(url);
  if (!embed) {
    host.innerHTML = placeholder(emptyText);
    return;
  }
  host.innerHTML = `
    <iframe class="content-player" style="height:240px" src="${embed}"
      loading="lazy" allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    <a class="content-link" href="${url}" target="_blank" rel="noopener noreferrer">${buttonText}</a>`;
}

function renderRadio() {
  const host = document.getElementById("radio-content");
  const url = String(CONTEUDOS.radioIlda || "").trim();
  if (!url) {
    host.innerHTML = placeholder("Programação em preparação.");
    return;
  }

  if (/\.(mp3|wav|ogg)(\?.*)?$/i.test(url)) {
    host.innerHTML = `<audio controls preload="metadata" style="width:100%;margin-top:16px"><source src="${url}"></audio>`;
    return;
  }

  const embed = youtubeEmbed(url);
  if (embed) {
    host.innerHTML = `
      <iframe class="content-player" style="height:240px" src="${embed}"
        loading="lazy" allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      <a class="content-link" href="${url}" target="_blank" rel="noopener noreferrer">📻 Ouvir programa</a>`;
  } else {
    host.innerHTML = placeholder("Link da Rádio Ilda ainda não configurado.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderSpotify();
  renderYoutube("pod-content", CONTEUDOS.podSgp, "Conteúdo em breve.", "🎙️ Assistir POD SGP");
  renderYoutube("videos-content", CONTEUDOS.videosOficiais, "Vídeos em breve.", "▶️ Assistir vídeos");
  renderRadio();
});
