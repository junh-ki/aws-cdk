async function main(event: any) {
  const msg = "Hello, CDK!";
  console.log(msg);
  return {
    body: JSON.stringify({ message: msg }),
    statusCode: 200,
  };
};

module.exports = { main };
