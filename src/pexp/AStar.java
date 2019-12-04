package pexp;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;

public class AStar {

	// extend comparator.
	public class NodeComparator implements Comparator<ModelState> {
		public int compare(ModelState nodeFirst, ModelState nodeSecond) {
			if (nodeFirst.fValue > nodeSecond.fValue)
				return 1;
			if (nodeSecond.fValue > nodeFirst.fValue)
				return -1;
			return 0;
		}
	}

	/**
	 * Implements the A-star algorithm and returns the path from source to
	 * destination
	 * 
	 * @param source
	 *            the source nodeid
	 * @return the path from source to destination
	 */
	public List<ModelState> astar(ModelState source) {
		/**
		 * http://stackoverflow.com/questions/20344041/why-does-priority-queue-has-default-initial-capacity-of-11
		 */
		final Queue<ModelState> openQueue = new PriorityQueue<ModelState>(11, new NodeComparator());

		ModelState sourceNodeData = source;
		openQueue.add(sourceNodeData);

		final Set<ModelState> closedList = new HashSet<ModelState>();

		int numStates = 0;
		while (!openQueue.isEmpty()) {
			final ModelState nodeData = openQueue.poll();

			if (nodeData.cost == ModelState.rpCost) {
				System.out.println("Number of nodes checked is: " + numStates);
				return nodeData.path;
			}

			closedList.add(nodeData);
			numStates++;

			//System.out.println("closedList size is " + closedList.size());
			ArrayList<ModelState> succs = nodeData.successors();
			for (ModelState succ : succs) {
				if (closedList.contains(succ))
					continue;
				if (openQueue.contains(succ)) {
					Iterator<ModelState> it = openQueue.iterator();
					while (it.hasNext()) {
						ModelState s = (ModelState) it.next();
						if (s.fValue > succ.fValue && s.id.compareToIgnoreCase(succ.id) == 0) {
							openQueue.remove(s);
							openQueue.add(succ);
							break;
						}
					}
					//openQueue.add(succ);
				} else {
					openQueue.add(succ);
				}
			}
		}

		return null;
	}
}
