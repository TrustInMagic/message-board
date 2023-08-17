function formatDate(date = new Date()) {
  const hours = date.toLocaleString('default', {
    hour: '2-digit',
    hour12: false,
  }); 
  const minutes = date.toLocaleString('default', { minute: '2-digit' });
  const day = date.toLocaleString('default', { day: '2-digit' });
  const month = date.toLocaleString('default', { month: '2-digit' });

  return `${hours}:${minutes} ${day}/${month}`;
}

module.exports = formatDate;
