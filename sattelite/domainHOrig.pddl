(define (domain satellite)
(:requirements :strips :equality :typing)
(:types satellite direction instrument mode)

(:predicates
           (on_board ?i - instrument ?s - satellite)
	       (supports ?i - instrument ?m - mode)
	       (pointing ?s - satellite ?d - direction)
	       (power_avail ?s - satellite)
	       (power_on ?i - instrument)
	       (calibrated ?i - instrument)
	       (have_image ?d - direction ?m - mode)
	       (calibration_target ?i - instrument ?d - direction)
)



(:action turn_to
   :parameters (?s - satellite ?d_new - direction ?d_prev - direction)
   :precondition (and (pointing ?s ?d_prev)
              )
   :effect (and  (pointing ?s ?d_new)
           )
  )


(:action switch_on
   :parameters (?i - instrument ?s - satellite)
   :precondition (and (on_board ?i ?s)
                 )
   :effect (and (power_on ?i)
           )

)


(:action switch_off
   :parameters (?i - instrument ?s - satellite)
   :precondition (and (on_board ?i ?s)
                  )
   :effect (and
           )
)

(:action calibrate
   :parameters (?s - satellite ?i - instrument ?d - direction)
   :precondition (and (on_board ?i ?s)
                  )
   :effect (calibrated ?i)
)


(:action take_image
   :parameters (?s - satellite ?d - direction ?i - instrument ?m - mode)
   :precondition (and (on_board ?i ?s) (supports ?i ?m) (power_on ?i) (pointing ?s ?d)
               )
   :effect (have_image ?d ?m)
)
)
