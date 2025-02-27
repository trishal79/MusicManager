let songs = [
    { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", duration: "5:55" },
    { title: "Shape of you", artist: "Ed Sheeran", album: "Divide", duration: "4:24" },
    { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:22" },
    { title: "Hotel california", artist: "Eagles", album: "Hotel California", duration: "6:30" },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind", duration: "5:01" },
    { title: "Rolling in the deep", artist: "Adele", album: "21", duration: "3:48" }
  ];
  
  let sortOrder = { title: true, artist: true, album: true, duration: true };
  let currentlyEditingRow = null;
  
  /**
   * Renders songs in the table
   */
  function displaySongs(songList) {
    const tbody = document.getElementById("playlist-body");
    tbody.innerHTML = "";
  
    songList.forEach((song, i) => {
      const row = `
        <tr id="row-${i}" class="song-row">
          <td>${i + 1}</td>
          <td contenteditable="false">${song.title}</td>
          <td contenteditable="false">${song.artist}</td>
          <td contenteditable="false">${song.album}</td>
          <td contenteditable="false" class="duration-cell">
            <div class="duration-text">${song.duration}</div>
            <div class="button-container">
              <button class="edit-btn" onclick="toggleEdit(${i})">✏️</button>
              <button class="delete-btn" onclick="deleteRow(${i})">🗑️</button>
            </div>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  }
  
  /**
   * Toggle edit mode:
   * If row is not in edit mode -> enter edit mode
   * If row is in edit mode -> exit edit mode
   */
  function toggleEdit(index) {
    if (currentlyEditingRow === index) {
      // If toggling the same row -> save
      saveRow(index);
      return;
    }
    if (currentlyEditingRow !== null) {
      // Another row was in edit -> save it first
      saveRow(currentlyEditingRow);
    }
    // Enter edit mode
    editRow(index);
  }
  
  /**
   * Put row in edit mode
   */
  function editRow(index) {
    const row = document.getElementById(`row-${index}`);
    const cells = row.querySelectorAll("td[contenteditable]");
  
    row.classList.add("highlight-edit-row", "edit-highlight");
    currentlyEditingRow = index;
  
    cells.forEach(cell => {
      cell.contentEditable = "true";
      cell.classList.add("editing-cell");
    });
  
    row.addEventListener("keydown", onRowKeydown);
  }
  
  /**
   * Save row (exit edit mode)
   */
  function saveRow(index) {
    const row = document.getElementById(`row-${index}`);
    const cells = row.querySelectorAll("td[contenteditable]");
  
    cells.forEach(cell => {
      cell.contentEditable = "false";
      cell.classList.remove("editing-cell");
    });
  
    row.classList.remove("highlight-edit-row", "edit-highlight");
    row.removeEventListener("keydown", onRowKeydown);
  
    currentlyEditingRow = null;
  }
  
  /**
   * If Enter is pressed -> exit edit mode
   */
  function onRowKeydown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveRow(currentlyEditingRow);
    }
  }
  
  /**
   * Delete row
   */
  function deleteRow(index) {
    songs.splice(index, 1);
    displaySongs(songs);
  }
  
  /**
   * Filter songs by query
   */
  function filterSongs(query) {
    const filteredSongs = songs.filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase()) ||
      song.album.toLowerCase().includes(query.toLowerCase())
    );
    displaySongs(filteredSongs);
  }
  
  /**
   * Reset sorting arrows
   */
  function resetArrows() {
    document.querySelectorAll("th.sortable .arrow").forEach(arrow => {
      arrow.textContent = "▲";
    });
  }
  
  /**
   * Sort the table by given column
   */
  function sortSongs(column, header) {
    sortOrder[column] = !sortOrder[column];
    resetArrows();
    header.querySelector(".arrow").textContent = sortOrder[column] ? "▲" : "▼";
  
    songs.sort((a, b) => {
      const aVal = a[column].toLowerCase();
      const bVal = b[column].toLowerCase();
      if (aVal < bVal) return sortOrder[column] ? -1 : 1;
      if (aVal > bVal) return sortOrder[column] ? 1 : -1;
      return 0;
    });
    displaySongs(songs);
  }
  
  /* Attach sorting events */
  document.querySelectorAll("th.sortable").forEach(header => {
    header.addEventListener("click", () => {
      const column = header.getAttribute("data-column");
      sortSongs(column, header);
    });
  });
  
  /**
   * Toggle the 'Add a Song' form. 
   * Changes heading text from ➕ to ✖ 
   * and smooth scrolls up/down.
   */
  document.getElementById("toggle-form").addEventListener("click", () => {
    const form = document.getElementById("add-song-form");
    const heading = document.getElementById("toggle-form");
    const isHidden = form.classList.contains("hidden");
  
    // Toggle form display
    form.classList.toggle("hidden", !isHidden);
    // Switch heading text
    heading.textContent = isHidden ? "✖ Add a Song" : "➕ Add a Song";
  
    if (!form.classList.contains("hidden")) {
      form.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  
  /**
   * Add a new song and hide the form
   */
  document.getElementById("add-song-btn").addEventListener("click", () => {
    const title = document.getElementById("title").value.trim();
    const artist = document.getElementById("artist").value.trim();
    const album = document.getElementById("album").value.trim();
    const duration = document.getElementById("duration").value.trim();
  
    if (title && artist && album && duration) {
      songs.push({ title, artist, album, duration });
      displaySongs(songs);
  
      // Reset form
      document.getElementById("add-song-form").reset();
      // Hide the form
      document.getElementById("add-song-form").classList.add("hidden");
      // Switch heading text to plus sign
      document.getElementById("toggle-form").textContent = "➕ Add a Song";
  
      // Smooth scroll up
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert("Please fill out all fields.");
    }
  });
  
  /**
   * Live search
   */
  document.getElementById("search-input").addEventListener("input", (e) => {
    filterSongs(e.target.value);
  });
  
  /**
   * On page load
   */
  window.onload = () => displaySongs(songs);
  