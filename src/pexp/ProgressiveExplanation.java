package pexp;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.Set;

public class ProgressiveExplanation {

	public final String domainR = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/rovers/domain.pddl";
	public final String domainH = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/rovers/human/domain-H.pddl";

	HashMap<String, ArrayList<String>> missingPreconditions;
	HashMap<String, ArrayList<String>> missingAddEffects;
	HashMap<String, ArrayList<String>> missingDelEffects;
	
	static Random rand = new Random(2);

	public ProgressiveExplanation(double missingProb) {
			
		missingPreconditions = new HashMap<String, ArrayList<String>>();
		missingAddEffects = new HashMap<String, ArrayList<String>>();
		missingDelEffects = new HashMap<String, ArrayList<String>>();

//		ArrayList<String> pre = new ArrayList<String>();
//		ArrayList<String> add = new ArrayList<String>();
//		ArrayList<String> del = new ArrayList<String>();
//
//		pre.add("(calibrated ?i ?r)");
//		missingPreconditions.put("take_image", pre);
//		
//		pre = new ArrayList<String>();
//		pre.add("(full ?y)");
//		pre.add("(store_of ?y ?x)");
//		missingPreconditions.put("drop", pre);
//		
//		pre = new ArrayList<String>();
//		pre.add("(can_fly ?x)");
//		missingPreconditions.put("fly", pre);
//		
//		//add.add("(at ?x ?z)");
//		//missingAddEffects.put("fly", add);
//		
//		del.add("(not (calibrated ?i ?r))");
//		missingDelEffects.put("take_image", del);
		
		ArrayList<String> types = new ArrayList<String>();
		types.add(":precondition");
		types.add(":parameters");
		types.add(":effect");
		types.add(":action");
		
		HashMap<String, ArrayList<String>> pres = findItem(domainR, ":precondition", types, false);
		HashMap<String, ArrayList<String>> addEffs = findItem(domainR, ":effect", types, false);
		HashMap<String, ArrayList<String>> delEffs = findItem(domainR, ":effect", types, true);
		
		double probRetain = 1.0 - missingProb;
		int count = 0, mCount = 0;
		
		Set<String> keys = pres.keySet();
		for (String key: keys) {
			ArrayList<String> missing = new ArrayList<String>();
			ArrayList<String> list = pres.get(key);
			for (String item: list) {
				if (rand.nextDouble() > probRetain) {
					missing.add(item);
					//System.out.println(key + ": " + item);
					mCount++;
				}
				count++;
			}
			missingPreconditions.put(key, missing);
		}
		keys = pres.keySet();
		for (String key: keys) {
			ArrayList<String> missing = new ArrayList<String>();
			ArrayList<String> list = addEffs.get(key);
			for (String item: list) {
				if (rand.nextDouble() > probRetain) {
					missing.add(item);
					//System.out.println(key + ": " + item);
					mCount++;
				}
				count++;
			}
			missingAddEffects.put(key, missing);
		}
		keys = pres.keySet();
		for (String key: keys) {
			ArrayList<String> missing = new ArrayList<String>();
			ArrayList<String> list = delEffs.get(key);
			for (String item: list) {
				if (rand.nextDouble() > probRetain) {
					missing.add(item);
					//System.out.println(key + ": " + item);
					mCount++;
				}
				count++;
			}
			missingDelEffects.put(key, missing);
		}
		System.out.println("There are a total of " + count + " items");
		System.out.println("Missing a total of " + mCount + " items with retaining prob " + probRetain);
	}
	
	String findNext(String line) {
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
	
	HashMap<String, ArrayList<String>> findItem(String domain, String type, 
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
							//System.out.println("Adding " + item + " to action " + action);
							list.add(item);
						} else if (!item.contains("(not") && !containNot) {
							//System.out.println("Adding " + item + " to action " + action);
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
	
	public String createDomainH(HashMap<String, ArrayList<String>> missingPreconditions,
			HashMap<String, ArrayList<String>> missingAddEffects, 
			HashMap<String, ArrayList<String>> missingDelEffects) {
		try {
			String domainH = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/rovers/domain-H.pddl";
			BufferedReader reader = new BufferedReader(new FileReader(domainR));
			BufferedWriter writer = new BufferedWriter(new FileWriter(domainH));
			String line = null;
			boolean foundAction = false;
			boolean inPre = false;
			boolean inEff = false;
			ArrayList<String> missingPre = null;
			ArrayList<String> missingAdd = null;
			ArrayList<String> missingDel = null;
			while ((line = reader.readLine()) != null) {
				// Where an action starts
				if (line.contains(":action")) {
					String action = line.split(" ")[1];
					// Found new action, must reset
					missingPre = missingPreconditions.get(action);
					missingAdd = missingAddEffects.get(action);
					missingDel = missingDelEffects.get(action);
					if (missingPre != null || missingAdd != null || missingDel != null) {
						foundAction = true;
						inPre = false;
						inEff = false;
					} else {
						foundAction = false;
					}
				}
				if (foundAction) {
					if (line.contains(":precondition")) {
						inPre = true;
						inEff = false;
					} else if (line.contains(":effect")) {
						inPre = false;
						inEff = true;
					} else if (line.contains(":parameters")) {
						inPre = false;
						inEff = false;
					}
				}
				if (foundAction) {
					if (inPre && missingPre != null) {
						for (String pre : missingPre) {
							if (line.contains(pre)) {
								// Remove the precondition
								line = line.substring(0, line.indexOf(pre))
										+ line.substring(line.indexOf(pre) + pre.length());
							}
						}
						writer.write(line);
						writer.newLine();
					} else if (inEff) {
						if (missingAdd != null) {
							for (String add : missingAdd) {
								if (line.contains(add)) {
									line = line.substring(0, line.indexOf(add))
											+ line.substring(line.indexOf(add) + add.length());
								}
							}
						}
						if (missingDel != null) {
							for (String del : missingDel) {
								if (line.contains(del)) {
									line = line.substring(0, line.indexOf(del))
											+ line.substring(line.indexOf(del) + del.length());
								}
							}
						}
						writer.write(line);
						writer.newLine();
					} else {
						writer.write(line);
						writer.newLine();
					}
				} else {
					writer.write(line);
					writer.newLine();
				}
			}
			reader.close();
			writer.close();
			return domainH;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public ArrayList<String> callFD(String domain, String problem) {
		Runtime rt = Runtime.getRuntime();
		try {
			ArrayList<String> plan = new ArrayList<String>();
			Process pr = rt.exec(new String[] {"/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/fastdownward/fast-downward.py",
					domain,
					problem,
					"--search",
					"astar(lmcut())"}
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

	public static void main(String[] args) {
		
		double prob = 0.05;
		long sTime = 0, eTime = 0;
		for (int i = 0; i < 11; i++) {
			System.out.println("*** Start iteration " + i);
			sTime = System.currentTimeMillis();
			prob += 0.01;
			ProgressiveExplanation pexp = new ProgressiveExplanation(prob);
			pexp.createDomainH(pexp.missingPreconditions,
					pexp.missingAddEffects,
					pexp.missingDelEffects);
			String problem = "/Users/mehrdad/Dropbox (ASU)/workspace/Publish/Online Explanations/rovers/pfile01";
			
			// Compute the robot plan's cost
			ArrayList<String> plan = pexp.callFD(pexp.domainR, problem);	
			double rpCost = (double) plan.size();
			System.out.println("Plan cost with robot model is " + rpCost);
			plan = pexp.callFD(pexp.domainH, problem);
			double hpCost = (double) plan.size();
			if (hpCost <= 0.0) hpCost = 0.0;
			System.out.println("Plan cost with human model is " + hpCost);
			
			ModelState.init(pexp, rpCost, hpCost, problem);
			ModelState init = new ModelState();
	
			AStar aStar = new AStar();
			List<ModelState> path = aStar.astar(init);
			System.out.println("Path length is " + path.size());
			for (ModelState s: path) {
				System.out.println(s.id + " with plan cost " + s.cost);
			}
			eTime = System.currentTimeMillis();
			int sum = 0;
			for (ModelState s: path) {
				sum += s.retValue;
			}
			if (path.size() > 0)
				System.out.println("The sum of value is: " + sum);
			else 
				System.out.println("The sum of value is: " + 0.0);
			System.out.println("Used time " + (eTime - sTime) / 1000.0 + "s");
			System.out.println("*** Finished iteration " + i + "\n\n");
		}
	}
}
