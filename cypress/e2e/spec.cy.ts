describe('Form and Content Generation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200'); // 替换为你的应用地址
  });

  it('should fill the form and generate content', () => {
    // 测试输入框
    cy.get('input[name="inputText"]').clear().type('Pizza');
    cy.get('input[name="inputText"]').should('have.value', 'Pizza');

    // 测试文本区域
    cy.get('textarea[placeholder="Ex. It makes me feel..."]').type('It makes me feel happy!');
    cy.get('textarea[placeholder="Ex. It makes me feel..."]').should('exist');

    // 点击生成内容按钮
    cy.contains('button', 'Generate Content').click();

    // 验证生成的内容
    cy.get('mat-card p').should('exist'); // 根据实际生成的内容进行验证
  });
});
