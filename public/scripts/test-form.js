document.addEventListener("DOMContentLoaded", () => {
    let editingId = null;
    const createButton = document.getElementById("create-button");
    const editButton = document.getElementById("edit-button");
    const form = document.getElementById("test-form");
    const entriesContainer = document.getElementById("entries-container");

    const clearContainer = (container) => {
        if (!container) {
            console.error("clearContainer: container is null");
            return;
        }
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    };

    const populateForm = (entry) => {
        form["instrumentType"].value = entry.instrumentType;

        const dt = new Date(entry.date);
        form["test-date"].value = dt.toISOString().slice(0, 10);
        form["test-time"].value = dt.toTimeString().slice(0, 5);

        form["name"].value = entry.name;
        form["phone"].value = entry.phone;
        form["email"].value = entry.email || '';
        form["comments"].value = entry.comments || '';

        editingId = entry.id;

        createButton.style.display = "none";
        editButton.style.display = "inline-block";
    };

    const loadEntries = async () => {
        try {
            const response = await fetch("/testdrive", {
                method: "GET"
            });
            const entries = await response.json();
            clearContainer(entriesContainer);

            if (entries.length === 0) {
                const noEntriesMessage = document.createElement("p");
                noEntriesMessage.textContent = "Записей пока нет.";
                entriesContainer.appendChild(noEntriesMessage);
            } else {
                const list = document.createElement("ul");
                list.classList.add("entries-list");

                entries.forEach((entry) => {
                    const listItem = document.createElement("li");
                    listItem.classList.add("entry-item");
                    const localDate = new Date(entry.date);
                    const formattedDate = localDate.toLocaleDateString("ru-RU");
                    const formattedTime = localDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

                    listItem.innerHTML = `
                    <strong>Инструмент:</strong> ${entry.instrumentType} <br>
                    <strong>Дата:</strong> ${formattedDate} <br>
                    <strong>Время:</strong> ${formattedTime} <br>
                    <strong>Имя:</strong> ${entry.name} <br>
                    <strong>Телефон:</strong> ${entry.phone} <br>
                    <strong>Почта:</strong> ${entry.email} <br>
                    <strong>Комментарий:</strong> ${entry.comments || "Нет"} <br>
                `;
                    const viewButton = document.createElement("button");
                    viewButton.textContent = "Открыть";
                    viewButton.addEventListener("click", async () => {
                        const response = await fetch(`/testdrive/${entry.id}`);
                        if (response.ok) {
                            const detailedEntry = await response.json();
                            showEntryDetails(detailedEntry);
                        } else {
                            alert("Ошибка при загрузке записи.");
                        }
                    });

                    const editButton = document.createElement("button");
                    editButton.textContent = "Редактировать";
                    editButton.addEventListener("click", () => {
                        populateForm(entry);
                    });

                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Удалить";
                    deleteButton.addEventListener("click", async () => {
                        await deleteEntry(entry.id);
                        loadEntries();
                    });
                    listItem.appendChild(editButton);
                    listItem.appendChild(deleteButton);
                    list.appendChild(listItem);
                    listItem.appendChild(viewButton);
                });

                entriesContainer.appendChild(list);
            }
        } catch (error) {
            console.error("Ошибка при загрузке записей:", error);
        }
    };

    const saveEntry = async (entry) => {
        try {
            const response = await fetch("/testdrive", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(entry),
            });

            if (response.ok) {
                alert("Вы успешно записались на тестирование!");
            } else {
                alert("Ошибка при сохранении записи.");
            }
        } catch (error) {
            console.error("Ошибка при сохранении записи:", error);
        }
    };

    const updateEntry = async (id, entry) => {
        try {
            const response = await fetch(`/testdrive/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(entry),
            });

            if (response.ok) {
                alert("Запись успешно обновлена!");
            } else {
                alert("Ошибка при обновлении записи.");
            }
        } catch (error) {
            console.error("Ошибка при обновлении записи:", error);
        }
    };

    const deleteEntry = async (id) => {
        try {
            const response = await fetch(`/testdrive/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("Запись удалена.");
            } else {
                alert("Ошибка при удалении записи.");
            }
        } catch (error) {
            console.error("Ошибка при удалении записи:", error);
        }
    };

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const date = form["test-date"].value;
            const time = form["test-time"].value;
            const fullDateTime = new Date(`${date}T${time}`).toISOString();

            const newEntry = {
                instrumentType: form["instrumentType"].value,
                date: fullDateTime,
                time: time,
                name: form["name"].value,
                phone: form["phone"].value,
                email: form["email"].value,
                comments: form["comments"].value || "",
            };

            if (editingId) {
                await updateEntry(editingId, newEntry);
                editingId = null;
            } else {
                await saveEntry(newEntry);
            }

            form.reset();
            await loadEntries();
        });
    }

    if (editButton) {
        editButton.addEventListener("click", async (e) => {
            e.preventDefault();

            const date = form["test-date"].value;
            const time = form["test-time"].value;
            const fullDateTime = new Date(`${date}T${time}`).toISOString();

            const updatedEntry = {
                instrumentType: form["instrumentType"].value,
                date: fullDateTime,
                time: time,
                name: form["name"].value,
                phone: form["phone"].value,
                email: form["email"].value,
                comments: form["comments"].value || "",
            };

            if (editingId) {
                await updateEntry(editingId, updatedEntry);
                editingId = null;
            }

            form.reset();
            await loadEntries();

            createButton.style.display = "inline-block";
            editButton.style.display = "none";
        });
    }

    const showEntryDetails = (entry) => {
        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("entry-details");
        const localDate = new Date(entry.date);
        const formattedDate = localDate.toLocaleDateString("ru-RU");
        const formattedTime = localDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

        detailsContainer.innerHTML = `
        <h3>Детали записи</h3>
        <p><strong>Инструмент:</strong> ${entry.instrumentType}</p>
        <p><strong>Дата:</strong> ${formattedDate} </p>
        <p><strong>Время:</strong> ${formattedTime} </p>
        <p><strong>Имя:</strong> ${entry.name}</p>
        <p><strong>Телефон:</strong> ${entry.phone}</p>
        <p><strong>Email:</strong> ${entry.email}</p>
        <p><strong>Комментарий:</strong> ${entry.comments || "Нет"}</p>
        <button onclick="this.parentElement.remove()">Закрыть</button>
    `;

        document.body.appendChild(detailsContainer);
    };

    loadEntries();
});
