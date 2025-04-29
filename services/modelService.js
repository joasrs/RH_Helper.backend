function formataData(data) {
  return data
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .format(data)
        .replace(",", "")
    : null;
}

module.exports = { formataData };
