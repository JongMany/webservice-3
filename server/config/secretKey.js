module.exports = {
  secretKey : process.env.JWT_SECRET, // 원하는 시크릿 ㅍ키
  option : {
    algorithm : "HS256", // 해싱 알고리즘
    expiresIn : "1m",  // 토큰 유효 기간
    issuer : "issuer" // 발행자
  }
}