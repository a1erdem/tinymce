test(
  'WrapperTest',

  [
    'ephox.boss.api.Gene',
    'ephox.boss.api.TestUniverse',
    'ephox.boss.api.TextGene',
    'ephox.phoenix.test.Finder',
    'ephox.phoenix.test.TestRenders',
    'ephox.phoenix.wrap.Wrapper',
    'ephox.phoenix.wrap.Wraps'
  ],

  function (Gene, TestUniverse, TextGene, Finder, TestRenders, Wrapper, Wraps) {
    var make = function () {
      return TestUniverse(
        Gene('root', 'root', [
          Gene('1', 'span', [
            TextGene('1.1', 'alpha'),
            TextGene('1.2', 'beta'),
            TextGene('1.3', 'gamma')
          ]),
          Gene('2', 'span', [
            TextGene('1.4', 'delta')
          ]),
          Gene('3', 'span', [
            TextGene('1.5', 'rho'),
            Gene('img', 'img'),
            TextGene('1.6', 'epsilon')
          ])
        ])
      );
    };

    var check = function (postTest, expected,  startId, startOffset, finishId, finishOffset) {
      var doc = make();
      var start = Finder.get(doc, startId);
      var finish = Finder.get(doc, finishId);
      var predicate = function (item) {
        return item.name === 'span';
      };

      var counter = 0;
      var nu = function () {
        counter++;
        return Wraps(doc, Gene('new-span-' + counter, 'span', []));
      };

      var actual = Wrapper.reuse(doc, start, startOffset, finish, finishOffset, predicate, nu);
      assert.eq(expected, TestRenders.ids(actual));
      assert.eq(postTest, doc.shortlog(function (item) {
        return item.name === 'TEXT_GENE' ? 'text("' + item.text + '")' : item.id;
      }));
    };
      
    check('root(1(new-span-1(text("alpha"),text("b")),text("eta"),text("gamma")),2(text("delta")),3(text("rho"),img,text("epsilon")))', [
      'new-span-1'
    ], '1.1', 0, '1.2', 1);

    check('root(1(text("alpha"),text("b"),new-span-1(text("eta"),text("gamma"))),2(text("delta")),3(new-span-2(text("rho")),img,text("epsilon")))', [
      'new-span-1',
      '2',
      'new-span-2'
    ], '1.2', 1, '1.5', 3);

    check('root(1(text("alpha"),text("beta"),text("gamma")),2(text("delta")),3(new-span-1(text("rho")),img,text("epsilon")))', [
      '1',
      '2',
      'new-span-1'
    ], '1.1', 0, '1.5', 3);
  }
);
