const customParttern = {
  defaultDate: '01-01-2000',
  date: 'DD-MM-YYYY',
  backEndDatePattern: 'YYYY-MM-DD',
  phone: /(?:\+84|0)[35789]\d{8}\b/,
  imageTypeRegex: /image\/(png|jpg|jpeg)/gm,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}
export default customParttern
