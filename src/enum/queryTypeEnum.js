export const QueryType = Object.freeze({
  // key (QueryType 객체의 속성 이름 - 디비에서 사용됨) : value (키에 매핑되어 실제로 사용되는 문자열 값 - 프롱트에서 요청으로 전달되는 값)
  ItemNewAll: 'ItemNewAll',
  ItemNewSpecial: 'ItemNewSpecial',
  Bestseller: 'Bestseller',
  BlogBest: 'BlogBest',
  ItemEditorChoice: 'ItemEditorChoice',
});

// Object.freeze()의 역할: 해당 객체의 모든 속성을 동결(freeze)하여 이후에 CRUD불가능하게 함 (immutable로 만드는 메스드)

// Object.freeze()는 얕은 동결(shallow freeze)을 수행. 즉, 객체의 최상위 속성만 변경 불가능하게 만듦. 만약 객체의 속성 중 하나가 또 다른 객체라면, 그 내부 객체는 변경될 수 있음.
// const obj = Object.freeze({
//     nested: { value: 42 },
//   });

//   obj.nested.value = 100; // 변경 가능
//   console.log(obj.nested.value); // 100
