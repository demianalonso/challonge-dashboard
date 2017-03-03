import {
  test
} from './index.js'

import { tournament, match } from './fixtureUtils'

describe('challonge parseTournament single elimination', () => {
  it('returns a completed tournament', () => {
    const challongeTournament = tournament(
                match({
                  previousMatch1: match({
                                    player1: 1,
                                    previousMatch2: match({
                                                        player1: 4,
                                                        player2:5}),
                                                    }),
                  previousMatch2: match({
                                    player1: 2,
                                    previousMatch2: match({
                                                        player1:3,
                                                        player2: 6
                                                    })
                                  })
                })
    )

    const domainTournament = test.parseTournament(challongeTournament)
    expect(domainTournament.type).toEqual('SingleElimination')
    const matches = domainTournament.matches
    expect(matches).toHaveLength(7)
    const findMatchByOrder = (order) => matches.find( (m) => m.order === order)


    expect(findMatchByOrder(7)).toBeMatch({player1: null, player2: null, order: 7, round: 3})
    expect(findMatchByOrder(6)).toBeMatch({player1: {id:2}, player2: null, order: 6, round: 2})
    expect(findMatchByOrder(5)).toBeMatch({player1: {id:1}, player2: null, order: 5, round: 2})
    expect(findMatchByOrder(4)).toBeMatch({player1: {id:3}, player2: {id:6}, order: 4, round: 1})
    expect(findMatchByOrder(3)).toBeMatch({player1: {id:2}, player2: null, order: 3, round: 1})
    expect(findMatchByOrder(2)).toBeMatch({player1: {id:4}, player2: {id:5}, order: 2, round: 1})
    expect(findMatchByOrder(1)).toBeMatch({player1: {id:1}, player2: null, order: 1, round: 1})

  })

})
expect.extend({
  toBeMatch(received, expected) {
    const fail = (property) => ({
      pass:false,
      message:`expect value ${this.utils.printExpected(expected[property])} for property ${property} but got ${this.utils.printReceived(received[property])}\
      \n\nFull expected object: ${this.utils.printExpected(expected)}\
      \n\nFull received object: ${this.utils.printReceived(received)}\
      `
    })

    for(let key in expected) {
      if(typeof expected[key] === 'object' ) {
        expect(received[key]).toBeMatch(expected[key])
      }
      else if(expected[key] !== received[key]) {
        return fail(key)
      }
    }

    return {pass:true}
  }
})
