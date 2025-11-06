async function main(event: any) {
  const msg = "Lambda Calculate Notify!";
  console.log(msg);
  return {
    body: JSON.stringify({ message: msg }),
    statusCode: 200,
  };
};

module.exports = { main };
