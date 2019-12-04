package pexp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;

public class ModelState {

	// Keep the human model
	//String model, modelR;
	public static ProgressiveExplanation pexp = null;
	public static double hpCost = -1, rpCost = -1;
	public double cost = -1;
	public static String problem = null;
	double gValue = 0, hValue = 0, fValue = 0, retValue = 0;
	public String id;
	ArrayList<ModelState> path = null;
	public static int hCnt = 0;
	
	// Keep the changes 
	HashMap<String, ArrayList<String>> addedPreconditions;
	HashMap<String, ArrayList<String>> addedAddEffects;
	HashMap<String, ArrayList<String>> addedDelEffects;    
	
	public String getKey() {
		String stateKey = "KEY-PRE-";
		Set<String> keys = pexp.missingPreconditions.keySet();
		for (String key: keys) {
			ArrayList<String> pres = pexp.missingPreconditions.get(key);
			for (String pre: pres) {
				if (addedPreconditions.containsKey(key)) {
					if (addedPreconditions.get(key).contains(pre)) {
						stateKey += key + ":" + pre + "-";
					}
				}
			}
		}
		stateKey += "ADD-";
		keys = pexp.missingAddEffects.keySet();
		for (String key: keys) {
			ArrayList<String> addEffs = pexp.missingAddEffects.get(key);
			for (String addEff: addEffs) {
				if (addedAddEffects.containsKey(key)) {
					if (addedAddEffects.get(key).contains(addEff)) {
						stateKey += key + ":" + addEff + "-";
					}
				}
			}
		}
		stateKey += "DEL-";
		keys = pexp.missingDelEffects.keySet();
		for (String key: keys) {
			ArrayList<String> delEffs = pexp.missingDelEffects.get(key);
			for (String delEff: delEffs) {
				if (addedDelEffects.containsKey(key)) {
					if (addedDelEffects.get(key).contains(delEff)) {
						stateKey += key + ":" + delEff + "-";
					}
				}
			}
		}
		return stateKey;
	}
	
	public static void init(ProgressiveExplanation pexp, Double rpCost, Double hpCost, String problem) {
		ModelState.pexp = pexp;
		ModelState.rpCost = rpCost;
		ModelState.hpCost = hpCost;
		ModelState.problem = problem;
	}
	
	//  this function should only be called once by the initial state
	public ModelState() {
		addedPreconditions = new HashMap<String, ArrayList<String>>();
		addedAddEffects = new HashMap<String, ArrayList<String>>();
		addedDelEffects = new HashMap<String, ArrayList<String>>();
		gValue = 0.0;
		hValue = heuristic();
		fValue = gValue + hValue;
		id = getKey();
		path = new ArrayList<ModelState>();
	}
	
	private ModelState(HashMap<String, ArrayList<String>> addedPres,
			HashMap<String, ArrayList<String>> addedAddEffs,
			HashMap<String, ArrayList<String>> addedDelEffs,
			double gValue,
			double cost,
			ModelState parent) {
		addedPreconditions = addedPres;
		addedAddEffects = addedAddEffs;
		addedDelEffects = addedDelEffs;
		
//		// for PEG
		this.gValue = gValue + 0.001;
		hValue = heuristic();
		this.gValue += Math.abs(this.cost - cost) * Math.abs(this.cost - cost);
		retValue = Math.abs(this.cost - cost) * Math.abs(this.cost - cost);
		
		// for normal 
//		hValue = heuristic();
//		this.gValue = gValue + 1.0;
//		hValue = 0.0;
//		retValue += Math.abs(this.cost - cost) * Math.abs(this.cost - cost);
		
		fValue = this.gValue + hValue;
		id = getKey();
		path = new ArrayList<ModelState>(parent.path);
		path.add(this);
	}
	
	
	public ArrayList<ModelState> successors() {
		ArrayList<ModelState> successors = new ArrayList<ModelState>();
		
		HashMap<String, ArrayList<String>> missingPres = 
				getMissingPreconditions(pexp.missingPreconditions);
		Set<String> keys = missingPres.keySet();
		for (String key: keys) {
			ArrayList<String> pres = missingPres.get(key);
			for (String pre: pres) {
				HashMap<String, ArrayList<String>> copyPreMap = copyMap(addedPreconditions);
				HashMap<String, ArrayList<String>> copyAddEffMap = copyMap(addedAddEffects);
				HashMap<String, ArrayList<String>> copyDelEffMap = copyMap(addedDelEffects);
				ArrayList<String> copy = copyPreMap.get(key);
				if (copy == null) copy = new ArrayList<String>();
				copy.add(pre);
				copyPreMap.put(key, copy);
				successors.add(new ModelState(copyPreMap, copyAddEffMap, copyDelEffMap, gValue, cost, this));
			}
		}
		
		HashMap<String, ArrayList<String>> missingAddEffs = 
				getMissingAddEffects(pexp.missingAddEffects);
		keys = missingAddEffs.keySet();
		for (String key: keys) {
			ArrayList<String> addEffs = missingAddEffs.get(key);
			for (String addEff: addEffs) {
				HashMap<String, ArrayList<String>> copyPreMap = copyMap(addedPreconditions);
				HashMap<String, ArrayList<String>> copyAddEffMap = copyMap(addedAddEffects);
				HashMap<String, ArrayList<String>> copyDelEffMap = copyMap(addedDelEffects);
				ArrayList<String> copy = copyAddEffMap.get(key);
				if (copy == null) copy = new ArrayList<String>();
				copy.add(addEff);
				copyAddEffMap.put(key, copy);
				successors.add(new ModelState(copyPreMap, copyAddEffMap, copyDelEffMap, gValue, cost, this));
			}
		}
		
		HashMap<String, ArrayList<String>> missingDelEffs = 
				getMissingDelEffects(pexp.missingDelEffects);
		keys = missingDelEffs.keySet();
		for (String key: keys) {
			ArrayList<String> pres = missingDelEffs.get(key);
			for (String pre: pres) {
				HashMap<String, ArrayList<String>> copyPreMap = copyMap(addedPreconditions);
				HashMap<String, ArrayList<String>> copyAddEffMap = copyMap(addedAddEffects);
				HashMap<String, ArrayList<String>> copyDelEffMap = copyMap(addedDelEffects);
				ArrayList<String> copy = copyDelEffMap.get(key);
				if (copy == null) copy = new ArrayList<String>();
				copy.add(pre);
				copyDelEffMap.put(key, copy);
				successors.add(new ModelState(copyPreMap, copyAddEffMap, copyDelEffMap, gValue, cost, this));
			}
		}
		return successors;
	}
	
	public HashMap<String, ArrayList<String>> copyMap(HashMap<String, ArrayList<String>> from) {
		HashMap<String, ArrayList<String>> to = new HashMap<String, ArrayList<String>>();
		Set<String> keys = from.keySet();
		for (String key: keys) {
			ArrayList<String> values = from.get(key);
			ArrayList<String> copy = new ArrayList<String>(values);
			to.put(key, copy);
		}
		return to;
	}
	
	public double heuristic() {	
		hCnt++;
		//if (hCnt % 100 == 0)System.out.println("Heuristic being called " + hCnt + " times");
		HashMap<String, ArrayList<String>> pres = getMissingPreconditions(pexp.missingPreconditions);
		HashMap<String, ArrayList<String>> addEffs = getMissingAddEffects(pexp.missingAddEffects);
		HashMap<String, ArrayList<String>> delEffs = getMissingDelEffects(pexp.missingDelEffects);
		String domainH = pexp.createDomainH(pres, addEffs, delEffs);
		ArrayList<String> plan = pexp.callFD(domainH, problem);
		cost = plan.size();
//		if (cost <= 0) {
//			cost = 1000000;
//			return 1000000;
//		}
		//System.out.println("Plan cost is " + cost + ":");
//		for (String action: plan) {
//			System.out.println(action);
//		}
		return 0.5 * Math.abs(plan.size() - ModelState.rpCost) * Math.abs(plan.size() - ModelState.rpCost);
	}
	
	/*
	 * return the missing preconditions minus the added preconditions from this state
	 */
	HashMap<String, ArrayList<String>> getMissingPreconditions(HashMap<String, 
			ArrayList<String>> missingPreconditions) {
		HashMap<String, ArrayList<String>> missingPres = new HashMap<String, ArrayList<String>>();
		Set<String> keys = missingPreconditions.keySet();
		for (String key: keys) {
			if (addedPreconditions.containsKey(key)) {
				ArrayList<String> pres = missingPreconditions.get(key);
				ArrayList<String> added = addedPreconditions.get(key);
				ArrayList<String> copy = new ArrayList<String>(pres);
				for (String pre: pres) {
					if (added.contains(pre)) {
						copy.remove(pre);
					}
				}
				missingPres.put(key, copy);
			} else {
				missingPres.put(key, missingPreconditions.get(key));
			}
		}
		return missingPres;
	}
	
	HashMap<String, ArrayList<String>> getMissingAddEffects(HashMap<String, 
			ArrayList<String>> missingAddEffects) {
		HashMap<String, ArrayList<String>> missingAddEffs = new HashMap<String, ArrayList<String>>();
		Set<String> keys = missingAddEffects.keySet();
		for (String key: keys) {
			if (addedAddEffects.containsKey(key)) {
				ArrayList<String> addEffs = missingAddEffects.get(key);
				ArrayList<String> added = addedAddEffects.get(key);
				ArrayList<String> copy = new ArrayList<String>(addEffs);
				for (String eff: addEffs) {
					if (added.contains(eff)) {
						copy.remove(eff);
					}
				}
				missingAddEffs.put(key, copy);
			} else {
				missingAddEffs.put(key, missingAddEffects.get(key));
			}
		}
		return missingAddEffs;
	}
	
	HashMap<String, ArrayList<String>> getMissingDelEffects(HashMap<String, 
			ArrayList<String>> missingDelEffects) {
		HashMap<String, ArrayList<String>> missingDelEffs = new HashMap<String, ArrayList<String>>();
		Set<String> keys = missingDelEffects.keySet();
		for (String key: keys) {
			if (addedDelEffects.containsKey(key)) {
				ArrayList<String> addDels = missingDelEffects.get(key);
				ArrayList<String> added = addedDelEffects.get(key);
				ArrayList<String> copy = new ArrayList<String>(addDels);
				for (String eff: addDels) {
					if (added.contains(eff)) {
						copy.remove(eff);
					}
				}
				missingDelEffs.put(key, copy);
			} else {
				missingDelEffs.put(key, missingDelEffects.get(key));
			}
		}
		return missingDelEffs;
	}
	
	@Override
	public boolean equals(Object o) {
	      return (o instanceof ModelState) && (((ModelState) o).id).equals(this.id);
	  }
}
