describe("temp integration", () => {
	test("should return 10*2=20", () => {
		const multiply = (a: number, b: number): number => a * b;

		const result = multiply(10, 2);
		expect(result).toBe(20);
	});
});
