// :Record acts like hash-tables(dictoriony) form py.
const data: Record<number, string> = {
    10: "megan",
    20: "lori",
  };
  
  data[5] = "joe";
  
  for (let i = 0; i < 10; i++) {
    console.log(i);
  }

  const myValues:number[] = [1,2,3]
  
  myValues.forEach((a) => console.log(a));
  const multipliedValues = myValues.map((a) => a * 10);