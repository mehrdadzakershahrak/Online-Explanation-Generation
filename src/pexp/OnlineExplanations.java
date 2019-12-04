// Copyright (C) Mehrdad Zakershahrak, 2019
package pexp;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Random;
import java.util.Scanner;
import java.util.Set;

enum Role {
	PRECONDITION,
	ADD_EFFECT,
	DELETE_EFFECT,
}

class ActionRoles {
	HashMap<String, HashSet<Role>> actionRoles;
	ArrayList<String> actions;

	
	public ActionRoles() {
		this.actionRoles = new HashMap<>();
		this.actions = new ArrayList<>();
	}

	public void add(String action, Role role) {
		if (this.actionRoles.get(action) == null) {
			this.actionRoles.put(action, new HashSet<Role>());
			this.actions.add(action);
		}
		this.actionRoles.get(action).add(role);
	}
	public void delete(String action, Role role) {
		if (this.actionRoles.containsKey(action)) {
			this.actionRoles.get(action).remove(role);
			if (this.actionRoles.get(action).isEmpty()) {
				this.actionRoles.remove(action);
				this.actions.remove(action);
			}
		}
	}
	public void actionDelete(String action) {
		if (this.actionRoles.containsKey(action)) {
			this.actionRoles.remove(action);
			this.actions.remove(action);
		}
	}
public HashSet<Role> get(String action) {
		return this.actionRoles.get(action);
	}
	public String chooseRandomAction(Random rand) {
		if (actions.size() == 0) return "done";
		int value = rand.nextInt(actions.size());
		return actions.get(value);
	}
	public ArrayList<String> getActions() {
		return (ArrayList<String>)this.actions.clone();
	}
}

class Predicates {
	HashMap<String, ArrayList<String>> preconditions;
	HashMap<String, ArrayList<String>> addEffects;
	HashMap<String, ArrayList<String>> delEffects;
	public Predicates(String filename) {
		ArrayList<String> types = new ArrayList<String>();
		types.add(":precondition");
		types.add(":parameters");
		types.add(":effect");
		types.add(":action");
		// find all preconditions
		this.preconditions = findItem(filename, ":precondition", types, false);
		// find all effects need to be added
		this.addEffects = findItem(filename, ":effect", types, false);
		// find all effects need to be deleted
		this.delEffects = findItem(filename, ":effect", types, true);
	}
	// human.predicateDiff(robot, ..)
	// predicate => List((action, List(role)))
	public HashMap<String, ActionRoles> predicateDiff(Predicates other) {
		// finds the difference between first and second, returns results
		HashMap<String, ActionRoles> diff = new HashMap<>();
		prediacteDiffHelper(this.preconditions, other.preconditions, Role.PRECONDITION, diff);
		prediacteDiffHelper(this.addEffects, other.addEffects,Role.ADD_EFFECT, diff);
		prediacteDiffHelper(this.delEffects, other.delEffects, Role.DELETE_EFFECT, diff);
		return diff;
	}
	
	static void prediacteDiffHelper(HashMap<String, ArrayList<String>> first, 
													   HashMap<String, ArrayList<String>> second, Role role,
													   HashMap<String, ActionRoles> output) {
		// lesson learned. deep copying to avoid Java pass by reference problems
		HashMap<String, ArrayList<String>> copy = new HashMap<>();
		for (Entry<String, ArrayList<String>> entry : second.entrySet()) {
			copy.put(entry.getKey(), new ArrayList<String>(entry.getValue()));
		}
		Set<String> actions = first.keySet();
		for (String action : actions) {
			ArrayList<String> firstPredicates = first.get(action);
			ArrayList<String> secondPredicates = copy.get(action);
			// find the difference
			secondPredicates.removeAll(firstPredicates);
			// update the HashMap
			for (String predicate: secondPredicates) {
				if (output.get(predicate) == null) {
					output.put(predicate, new ActionRoles());
				}
				output.get(predicate).add(action, role);
			}
		}
	}

	static HashMap<String, ArrayList<String>> findItem(String domain, String type, 
			ArrayList<String> allTypes, boolean containNot) {
		HashMap<String, ArrayList<String>> itemMap = new HashMap<String, ArrayList<String>>();
		try {
			BufferedReader reader = new BufferedReader(new FileReader(domain));
			String line, action = null;
			boolean inItem = false;
			while ((line = reader.readLine()) != null) {
				for (String nonType: allTypes) {
					if (nonType.compareToIgnoreCase(type) != 0) {
						if (line.contains(nonType)) {
							inItem = false;
						}
					}
				}
				if (inItem) {
					line = line.trim();
					ArrayList<String> list = new ArrayList<String>();
					if (itemMap.get(action) != null) {
						list = itemMap.get(action);
					} else {
						itemMap.put(action, list);
					}
					while (line.length() > 1) {
						String item = findNext(line);
						line = line.substring(line.indexOf(item) + item.length());
						line = line.trim();
						if (item.contains("(not") && containNot) {
							//System.out.println("Adding " + item + " to action " + action);
							list.add(item);
						} else if (!item.contains("(not") && !containNot) {
							//System.out.println("Adding " + item + " to action " + action);
							list.add(item);
						}
					}
				}
				if (line.contains(":action")) {
					action = line.split(" ")[1];
					inItem = false;
				}
				if (line.contains(type)) {
					line = line.substring(line.indexOf(type) + type.length());
					line = line.trim();
					if (line.contains("(and")) {
						line = line.substring(line.indexOf("(and") + "(and".length());
						line = line.trim();
					}
					ArrayList<String> list = new ArrayList<String>();
					while (line.length() > 1) {
						String item = findNext(line);
						line = line.substring(line.indexOf(item) + item.length());
						line = line.trim();
						if (item.contains("(not") && containNot) {
							list.add(item);
						} else if (!item.contains("(not") && !containNot) {
							list.add(item);
						}
					}
					itemMap.put(action, list);
					inItem = true;
				} 
			}
			reader.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return itemMap;
	}
	
	static String findNext(String line) {
		int sIndex = 0;
		int leftParas = 1, rightParas = 0;
		int firstLeft = line.indexOf("(", sIndex);
		int l = firstLeft, r = -1;
		sIndex = l + 1;
		if (line.contains("(not")) {
			sIndex = l + 1;
		}
		while (leftParas > rightParas) {
			l = line.indexOf("(", sIndex);
			r = line.indexOf(")", sIndex);
			if (r < l && r >= 0) {
				rightParas++;
				sIndex = r + 1;
			} else if (l >= 0) {
				leftParas++;
				sIndex = l + 1;
			} else if (l < 0 && r >= 0) {
				rightParas++;
				sIndex = r + 1;
			} else {
				System.out.println("Unexpected values with remaining string as " + line);
				System.exit(-1);
			}
		}
		return line.substring(firstLeft, r + 1);
	}
}

public class OnlineExplanations {
	
	public final String domainR = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/barman/domain.pddl";
	public final String domainH = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/barman/domain-H.pddl";
	public final String domainHOrig = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/barman/domainH-Orig.pddl";
	public final String domainHTmp = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/barman/domain-HPrime.pddl";
	
	public  HashMap<String, ActionRoles> diff;
	public  Predicates human;
	public  Predicates robot;
	//static Random rand = new Random(2);
	boolean finalSolutionFound;
	
	public OnlineExplanations() throws IOException {
//		candidates = new ArrayList<>();
		domainInit();
		finalSolutionFound = false;
	}
	
	public OnlineExplanations(double retainingProb) throws IOException {
		domainInit();
		finalSolutionFound = false;
		//Set<String> predicateList = diff.keySet();
		int sizeBefore = diff.size();
		ArrayList<String> removed = new ArrayList<>();
		System.out.println("There are a total of " + sizeBefore + " items");
		
		for (String predicate : diff.keySet()) {
			if (Math.random() > retainingProb) {
				removed.add(predicate);
			}
		}
		modifyMHList(removed, diff, domainH);
		int sizeAfter = removed.size();
		
		System.out.println("Missing a total of " + (sizeBefore - sizeAfter) + " items with retaining prob " + retainingProb);
	}
	
	public void domainInit() throws IOException {
		copyFileUsingJava7Files(domainHOrig, domainH);
		human = new Predicates(domainH);
		robot = new Predicates(domainR);
		// find the predicates that MR has but MH hasn't
		diff = human.predicateDiff(robot);
	}
	
	public void MME(String problem) throws IOException {
		
		ArrayList<String> planR = callFD(domainR, problem);
		ArrayList<String> planH = callFD(domainH, problem);
		ArrayList<String> predicates = new ArrayList<>(diff.keySet());
		int arr[] = new int[predicates.size()];
		ArrayList<ArrayList<String>> candidates = initCandidates(arr, predicates);
		int minSize = candidates.size();
		ArrayList<String> finalExp = new ArrayList<>();
		// MME
		for (ArrayList<String> candidate : candidates) {
			domainInit();
			modifyMHList(candidate, diff, domainH);
			planH = callFD(domainH, problem);
			if (planR.equals(planH) && candidate.size() < minSize) {
				minSize = candidate.size();
				finalExp.addAll(candidate);
				break;
			}
		}
		// Printing MME
		System.out.println(finalExp.size());
//		System.out.println(finalExp);
//		printPlan(planR, finalExp);
	}

	private void printPlan(ArrayList<String> planR, ArrayList<String> finalExp) {
		HashSet<Role> roles = null;
		for (String element : planR) {
			//boolean print = false;
			for (Iterator<String> itr = finalExp.iterator(); itr.hasNext();) {
				String predicate = itr.next();
				ActionRoles change = diff.get(predicate);
				ArrayList<String> actions = change.getActions();
				for(String action : actions) {
					if (action.equals(element.split(" ")[0])) {
						roles = change.get(action);
						System.out.print(roles + " ## ");
			    		System.out.print(predicate + " ## ");
			    		//System.out.print(element+ " ");
			    		itr.remove();
			    		//print = true;
					}
				}
			}
//			if (!print) {
			System.out.print(element + " ");
//			}
		}		
	}

	ArrayList<String> readOriginial(String domainHu) {
		ArrayList<String> modelH = new ArrayList<>();
		try {
			Scanner s = new Scanner(new File(domainHu));
			while (s.hasNextLine()) {
					modelH.add(s.nextLine());
			}
			s.close();
		} catch(Exception e) {
			e.printStackTrace();
		}
		return modelH;
	}
	
	ArrayList<String> modifyOriginal(ArrayList<ArrayList<String>> SolutionTrace) {
		ArrayList<String> modelH = readOriginial(domainHOrig);
		for (ArrayList<String> element : SolutionTrace) {
			for (String predicate : element) {
				String action = diff.get(predicate).getActions().get(0);
				int actionIdx = modelH.indexOf("(:action "+action);
				HashSet<Role> roles = diff.get(predicate).get(action);
				int modifyIdx = -1;
				if (roles.contains(Role.PRECONDITION)) {
					modifyIdx = actionIdx + 2;
				}
				else if (roles.contains(Role.ADD_EFFECT) || roles.contains(Role.DELETE_EFFECT)) {
					modifyIdx = actionIdx + 4;
				}
				modelH.set(modifyIdx, modelH.get(modifyIdx) + " " + predicate);
			}
		}
		return modelH;
	}
	
	HashMap<Integer, ArrayList<String>> humanExpectation(String problem, ArrayList<ArrayList<String>> solution) {
		
		ArrayList<ArrayList<String>> solutionTrace = new ArrayList<ArrayList<String>>();
		for (ArrayList<String> predicate : solution) {
			solutionTrace.add(predicate);
		}
		ArrayList<String> subExp = new ArrayList<>();
		for (ArrayList<String> element: solutionTrace) {
			for (String e : element) {
				subExp.add(e);
			}
		}
		int arr[] = new int[subExp.size()];
		ArrayList<ArrayList<String>> candidates = initCandidates(arr, subExp);
		HashMap<Integer, ArrayList<String>> numToCandidate = new HashMap<>();
		
		for (int i = 0; i < candidates.size(); i++) {
			numToCandidate.put(i, candidates.get(i));
		}
		
		HashMap<Integer, ArrayList<String>> candidateToPlan = new HashMap<>();
		
		for (int i = 0; i < candidates.size(); i++) {
			ArrayList<String> toRemove = numToCandidate.get(i);
			for (ArrayList<String> element : solutionTrace) {
				element.removeAll(toRemove);
			}
			ArrayList<String> modelH = modifyOriginal(solutionTrace);
			writeFile(domainHTmp, modelH);
			ArrayList<String> planH = callFD(domainHTmp, problem);
			candidateToPlan.put(i, planH);
		}
		return candidateToPlan;
	}
	
	public void findLongestMonotonic(String problem) throws IOException {
		ArrayList<String> planR = callFD(domainR, problem);
		ArrayList<String> planH = callFD(domainH, problem);
//		int orgActionDiff = planDiff(planR, planH);
		int orgActionDiff = planDiffIndp(planR, planH, planH.size()); // For planner Indp 
		ArrayList<ArrayList<String>> bestSolution = new ArrayList<>();
		bestSolution = findLongestMonotonicHelper(diff, bestSolution, orgActionDiff, problem, planR);
		ArrayList<String> finalExp = new ArrayList<>();
		for (ArrayList<String> subExp : bestSolution) {
			finalExp.addAll(subExp);
		}
		printPlan(planR, finalExp);
//		System.out.println(finalExp.size());
	}
	
	public void findLongestRelax(String problem) throws IOException {
		ArrayList<String> planR = callFD(domainR, problem);
		ArrayList<String> planH = callFD(domainH, problem);
		int orgActionDiff = planDiff(planR, planH);
		ArrayList<ArrayList<String>> bestSolution = new ArrayList<>();
		bestSolution = findLongestRelaxHelper(diff, bestSolution, orgActionDiff, problem, planR);
		ArrayList<String> finalExp = new ArrayList<>();
		for (ArrayList<String> subExp : bestSolution) {
			finalExp.addAll(subExp);
		}
		printPlan(planR, finalExp);
//		System.out.println(finalExp.size());
	}
	
private ArrayList<ArrayList<String>> findLongestRelaxHelper(HashMap<String, ActionRoles> difference,
            ArrayList<ArrayList<String>> bestSolution, int ActionDiff, 
            String problem, ArrayList<String> planR) throws IOException {
	ArrayList<ArrayList<String>> visitedPlusBest = new ArrayList<>();
	visitedPlusBest.addAll(bestSolution);
	ArrayList<String> combined = new ArrayList<>();
	for (ArrayList<String> element: visitedPlusBest) {
			for (String e : element) {
					combined.add(e);
			}
	}

	ArrayList<String> modelH = modifyOriginal(bestSolution);
	writeFile(domainH, modelH);
	ArrayList<String> Hplan = callFD(domainH, problem);
	computePlanDistance(planR, Hplan);
	if(callFD(domainH, problem).equals(planR)) {
		//	found it!!!
		finalSolutionFound = true;
		ArrayList<String> finalExp = new ArrayList<>();
		int countExp = 0;
		for (ArrayList<String> subExp : bestSolution) {
			finalExp.addAll(subExp);
			countExp += subExp.size();
		}
		System.out.print(countExp + " Explanations generated in ");
		System.out.println(bestSolution.size() + " times");
		double avg = ((double) countExp) /bestSolution.size();
		System.out.format("The avg explanation size is: %.3f", avg);
		System.out.println(" ");
		printPlan(Hplan, finalExp);
		return bestSolution;
	}
	ArrayList<String> remaining = new ArrayList<>(difference.keySet());
	remaining.removeAll(combined);
	int arr[] = new int[remaining.size()];
	ArrayList<ArrayList<String>> candidates = initCandidates(arr, remaining);

	for (ArrayList<String> candidate : candidates) {
		if (modifyMHList(candidate, difference, domainH, problem, planR, modelH, ActionDiff)) {
			bestSolution.add(candidate);
//			System.out.println("candidate is: "+ candidate);
			modelH = modifyOriginal(bestSolution);
			writeFile(domainH, modelH);
			ArrayList<ArrayList<String>> latestSolution = findLongestRelaxHelper(difference, bestSolution, planDiffRelax(planR, callFD(domainH, problem), ActionDiff), problem, planR);
			if (finalSolutionFound) {
				return  latestSolution;	
			}
			bestSolution.remove(bestSolution.size()-1);
		}
	}
		return bestSolution;
	}	
	
	
	public void relaxedPlanPrefix(String problem) throws IOException {
		ArrayList<String> planR = callFD(domainR, problem);
		ArrayList<String> planH = callFD(domainH, problem);
		int idx = 0;
		ArrayList<String> relaxed = new ArrayList<>();
		while (idx < Math.min(planR.size(), planH.size())) {
			if (!planR.get(idx).equals(planH.get(idx))) {
				//find similarities between the action predicates in PR and differences
				for (String predicate : diff.keySet()) {
					ActionRoles candidate  = diff.get(predicate);
					ArrayList <String> actionList = candidate.getActions();
					for (String action : actionList) {
						if (planR.get(idx).contains(action)) {
							if (!relaxed.contains(predicate)) {
								relaxed.add(predicate);
//								System.out.println(planR.get(idx) + " " + candidate.get(action));
//								System.out.println(predicate);
							}
						}
						else {
							continue;
						}
					}
				}
			}
			idx++;
		}
		System.out.println("Relaxed OEG number is:");
		System.out.println(relaxed.size());
	}
		
	private ArrayList<ArrayList<String>> findLongestMonotonicHelper(HashMap<String, ActionRoles> difference,
																			                                           ArrayList<ArrayList<String>> bestSolution, int ActionDiff, 
																			                                           String problem, ArrayList<String> planR) throws IOException {
		ArrayList<ArrayList<String>> visitedPlusBest = new ArrayList<>();
		visitedPlusBest.addAll(bestSolution);
		ArrayList<String> combined = new ArrayList<>();
		for (ArrayList<String> element: visitedPlusBest) {
			for (String e : element) {
				combined.add(e);
			}
		}
		
		ArrayList<String> modelH = modifyOriginal(bestSolution);
		writeFile(domainH, modelH);
		ArrayList<String> Hplan = callFD(domainH, problem);
		computePlanDistance(planR, Hplan);
		if(callFD(domainH, problem).equals(planR)) {
			//	found it!!!
			finalSolutionFound = true;
			ArrayList<String> finalExp = new ArrayList<>();
			int countExp = 0;
			for (ArrayList<String> subExp : bestSolution) {
				finalExp.addAll(subExp);
				countExp += subExp.size();
			}
			System.out.print(countExp + " Explanations generated in ");
			System.out.println(bestSolution.size() + " times");
			double avg = ((double) countExp) /bestSolution.size();
			System.out.format("The avg explanation size is: %.3f", avg);
			System.out.println(" ");
			printPlan(Hplan, finalExp);
			return bestSolution;
		}
		ArrayList<String> remaining = new ArrayList<>(difference.keySet());
		remaining.removeAll(combined);
		int arr[] = new int[remaining.size()];
		ArrayList<ArrayList<String>> candidates = initCandidates(arr, remaining);

		for (ArrayList<String> candidate : candidates) {
			if (modifyMHList(candidate, difference, domainH, problem, planR, modelH, ActionDiff)) {
//				finalSolutionFound = true; // For planner indp
				bestSolution.add(candidate);
				modelH = modifyOriginal(bestSolution);
				writeFile(domainH, modelH);
				ArrayList<ArrayList<String>> latestSolution = findLongestMonotonicHelper(difference, bestSolution, planDiff(planR, callFD(domainH, problem)), problem, planR);
				if (finalSolutionFound) {
					return  latestSolution;	
				}
				bestSolution.remove(bestSolution.size()-1);
			}
		}
		return bestSolution;
	}

	boolean modifyMHList(ArrayList<String> candidate, HashMap<String, ActionRoles> difference, 
			String domainHu, String problem, ArrayList<String> planR, ArrayList<String> modelH, int orgActionDiff) throws IOException {
		
		ArrayList<String> modelHTmp = new ArrayList<String>();
		for (int i = 0; i < modelH.size(); i++) {
			modelHTmp.add(modelH.get(i));
		}
		
		for (String predicate : candidate) {
				String action = difference.get(predicate).getActions().get(0);
				int actionIdx = modelHTmp.indexOf("(:action "+action);
				HashSet<Role> roles = difference.get(predicate).get(action);
				int modifyIdx = -1;
				if (roles.contains(Role.PRECONDITION)) {
					modifyIdx = actionIdx + 2;
				}
				else if (roles.contains(Role.ADD_EFFECT) || roles.contains(Role.DELETE_EFFECT)) {
					modifyIdx = actionIdx + 4;
				}
				modelHTmp.set(modifyIdx, modelHTmp.get(modifyIdx) + " " + predicate);
		}
		writeFile(domainHTmp, modelHTmp);
		ArrayList<String> planHTmp = callFD(domainHTmp, problem);
		
//		int newDiff = planDiff(planR, planHTmp);
		ArrayList<String> planH = callFD(domainHu,problem);
		int cost = planH.size();
//		int newDiff = planDiffIndp(planR, planHTmp, cost);
		int newDiff = planDiffRelax(planR, planHTmp, orgActionDiff);
		if (orgActionDiff < newDiff || newDiff == -1 ) {
			return true;
		}
		return false;
	}
	
	double computePlanDistance(ArrayList<String> planR, ArrayList<String> planHTmp)
	{
		double distance = 0.0;
		List<String> union = new ArrayList<String>();
		List<String> intersection = new ArrayList<String>();

		union.addAll(planR);
		for(String s : planHTmp) {
			if (!union.contains(s))
				union.add(new String(s)); 
		}
		for (int i=0; i< (planR.size() & planHTmp.size()); i++)
		{
			if((planR.get(i)).equals(planHTmp.get(i)))
			{intersection.add(new String(planR.get(i)));}
		}
		
		distance = 1 - (Double.valueOf(intersection.size())/Double.valueOf(union.size()));
		System.out.println("Distance: " + distance);
		union.clear();
		intersection.clear();
		return distance;
	}
	
	void modifyMHList(ArrayList<String> candidate, HashMap<String, ActionRoles> difference, 
									 String domainHu) {
		
		ArrayList<String> modelH = readOriginial(domainHu);
		
		for (String predicate : candidate) {
				String action = difference.get(predicate).getActions().get(0);
				int actionIdx = modelH.indexOf("(:action "+action);
				HashSet<Role> roles = difference.get(predicate).get(action);
				int modifyIdx = -1;
				if (roles.contains(Role.PRECONDITION)) {
					modifyIdx = actionIdx + 2;
				}
				else if (roles.contains(Role.ADD_EFFECT) || roles.contains(Role.DELETE_EFFECT)) {
					modifyIdx = actionIdx + 4;
				}
				
				modelH.set(modifyIdx, modelH.get(modifyIdx) + " " + predicate);
		}
		writeFile(domainHu, modelH);
		}

    int planDiff (ArrayList<String> planR, ArrayList<String> planH) {
		// returns the first number of action difference between the two plans
    	if (planR.equals(planH)) return -1;
		int actionNumber = 0;
		for (int i = 0; i < (planR.size() &  planH.size()); i++) {
			if (!planR.get(i).equals(planH.get(i))) {
				actionNumber = i;
				break;
			}
		}
//		if ((actionNumber > 0 && planR.size() == planH.size())) return -1; // for planner indp
		return actionNumber;
	}
    
    int planDiffRelax (ArrayList<String> planR, ArrayList<String> planH, int actionDiff) {
    	if (planR.equals(planH)) return -1;
    	if (planR.get(actionDiff).equals(planH.get(actionDiff)))
    	return actionDiff + 1;
    	return actionDiff;
	}
    
    int planDiffIndp (ArrayList<String> planR, ArrayList<String> planH, int cost) {
		int actionNumber = 0;
		for (int i = 0; i < (planR.size() &  planH.size()); i++) {
			if (!planR.get(i).equals(planH.get(i))) {
				actionNumber = i;
				break;
			}
		}
		if ((actionNumber > 0 && cost == planH.size())) return -1; 
		return actionNumber;
	}
	
	void writeFile(String domain, ArrayList<String> modelH) {
		try {
			FileWriter fw = new FileWriter(new File(domain), false);
			for (String line : modelH) {
				fw.write(line + "\n");
			}
			fw.close();
		}
		catch (Exception e) {
			e.printStackTrace();
			}
	}
	
	ArrayList<ArrayList<String>> combinationUtil(int arr[], int data[], int start, 
            int end, int index, int r, ArrayList<ArrayList<String>>candidates, ArrayList<String> remaining) {
		
		if (index == r) {
			ArrayList<String> tmp = new ArrayList<>();
			Iterator<String> itr; 
			for (int j=0; j<r; j++) {
				itr = remaining.iterator();
				for (int i = 0; i < data[j]; i++) {
					itr.next();
				}
				tmp.add(itr.next());
			}
			candidates.add(tmp);
			return candidates; 
		} 
	for (int i=start; i<=end && end-i+1 >= r-index; i++) { 
		data[index] = arr[i]; 
		combinationUtil(arr, data, i+1, end, index+1, r, candidates, remaining); 
		}
	return candidates; 
	} 
 
	ArrayList<ArrayList<String>> printCombination(int arr[], int n, int r, ArrayList<ArrayList<String>> candidates, ArrayList<String> seen)  { 
	int data[]=new int[r]; 
	
	return combinationUtil(arr, data, 0, n-1, 0, r, candidates, seen); 
} 

	ArrayList<ArrayList<String>> initCandidates(int arr[], ArrayList<String> seen) {
		for (int i = 0; i < arr.length; i++) {
			arr[i] = i;
		}
		ArrayList<ArrayList<String>> candidates = new ArrayList<>();
		for (int r = 1; r <= arr.length; r++) {
			printCombination(arr, arr.length,r, candidates, seen);
		}
		return candidates;
	}
	
	public ArrayList<String> callFD(String domain, String problem) {
		Runtime rt = Runtime.getRuntime();
		try {
			ArrayList<String> plan = new ArrayList<String>();
			Process pr = rt.exec(new String[] {"/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/fastdownward/fast-downward.py",
					"--alias",
					"lama-first",
					domain,
					problem}
			);
			pr.waitFor();
			BufferedInputStream input = new BufferedInputStream(pr.getInputStream());
			BufferedReader reader = new BufferedReader(new InputStreamReader(input));
			String line = null;
			boolean planFound = false;
			while ((line = reader.readLine()) != null) {
				//System.out.println(line);
				if (planFound) {
					plan.add(line);
				}
				if (line.contains("Actual search time:")) {
					planFound = true;
				} 
				if (line.contains("Plan length:")) {
					planFound = false;
					plan.remove(plan.size() - 1);
				}
				if (line.contains("Search stopped without finding a solution")) {
					plan.clear();
					planFound = false;
				}
			}
			return plan;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	private static void copyFileUsingJava7Files(String sourceLoc, String destLoc) throws IOException {
		 File source = new File(sourceLoc);
		 File dest = new File(destLoc);
		 dest.delete();
	      
	    Files.copy(source.toPath(), dest.toPath());
	}

	public static void main(String[] args) throws IOException {
		
//		for (int i = 1; i < 4; i++) {
//			double retainProb = 1.0;
//			String problem = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/rovers/pfile0"+i;
//			for (int j = 0; j < 9; j++) {
//				retainProb = retainProb - 0.1;
//				System.out.println("retain is: " + retainProb + " Problem " + i);
//				OnlineExplanations oeg = new OnlineExplanations(retainProb);
//				System.out.println("number of online explanations for OEG");
//				oeg.findLongestMonotonic(problem);
//				System.out.println("number of explanations for Complete");
//				oeg.MME(problem);
//			}
//			System.out.println("==========================================");
//		}
		String problem = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/barman/p2.pddl";
		long endTime = 0, startTime = 0 ;
		startTime = System.currentTimeMillis();
		OnlineExplanations oeg = new OnlineExplanations();
		System.out.println("OEG: ");
//		oeg.findLongestMonotonic(problem);
		oeg.findLongestRelax(problem);            
//		OnlineExplanations reg = new OnlineExplanations();
//		reg.relaxedPlanPrefix(problem);
//		System.out.println("MME number is:");
//		oeg.MME(problem);
		endTime = System.currentTimeMillis();
		System.out.println();
		System.out.println("Used time " + (endTime - startTime) / 1000.0 + "s");
	}
}