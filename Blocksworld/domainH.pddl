(define (domain blocks_world)
(:requirements :strips)
(:predicates (on-table ?x) (on ?x ?y) (clear ?x))

(:action MoveToTable
:parameters (?omf ?lower)
:precondition (and (on ?omf ?lower) (clear ?omf)
    )
:effect (and (on-table ?omf) (clear ?lower) (not (on ?omf ?lower))
    )
)

(:action MoveToBlock1
:parameters (?omf ?lower ?dest)
:precondition (and (clear ?omf) (clear ?dest) (on ?omf ?lower)
    )
:effect (and (clear ?lower)  (not (clear ?dest)) (on ?omf ?dest)
    )
)

(:action MoveToBlock2
:parameters (?omf ?dest)
:precondition (and (clear ?omf) (clear ?dest) (on-table ?omf)
    )
:effect (and (on ?omf ?dest) (not (on-table ?omf)))
    )
)
