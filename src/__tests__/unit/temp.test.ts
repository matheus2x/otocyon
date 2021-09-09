describe("temp unit", () => {
	test("should return 2+2=4", () => {
		const sum = (a: number, b: number): number => a + b;

		const result = sum(2, 2);
		expect(result).toBe(4);
	});
});
