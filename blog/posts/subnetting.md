# How IP Subnetting Actually Works

*A plain-English explanation written while studying for my Cisco networking module.*

---

## Why Does Subnetting Exist?

Imagine you have a building with 200 offices, but only one phone line coming in. Everyone gets one phone number, and distinguishing between offices is chaos. IP subnetting solves an equivalent problem in networking.

Without subnetting, every device on the internet would be in one giant flat network. Every packet would be broadcast to everyone. It would be incredibly slow and unmanageable.

Subnetting lets you **divide a network into smaller, more manageable segments** called subnets.

---

## The Basics: IP Address Structure

An IPv4 address looks like this: `192.168.1.100`

It's actually 32 bits of data, split into 4 groups of 8 bits (called octets):

```
192       .  168      .  1        .  100
11000000     10101000    00000001    01100100
```

Every IPv4 address has two parts:
- **Network portion** — identifies which network
- **Host portion** — identifies which device on that network

The **subnet mask** tells you where the dividing line is.

---

## The Subnet Mask

The subnet mask `255.255.255.0` in binary is:

```
11111111.11111111.11111111.00000000
```

The **1s** cover the network portion. The **0s** cover the host portion.

For `192.168.1.100` with mask `255.255.255.0`:
- Network: `192.168.1`
- Host: `100`

All devices in the range `192.168.1.1` to `192.168.1.254` are on the same network.

---

## CIDR Notation

Writing `255.255.255.0` gets old fast. CIDR (Classless Inter-Domain Routing) notation counts the number of **1-bits** in the mask:

`255.255.255.0` = 24 ones → written as `/24`

So `192.168.1.100/24` is equivalent to `192.168.1.100` with subnet mask `255.255.255.0`.

---

## Subnetting a Network: A Real Example

Say you're given `192.168.10.0/24` and need to divide it into 4 subnets.

**Step 1:** How many bits do I need to borrow from the host portion to make 4 subnets?

4 subnets = 2² → borrow **2 bits** → new mask = `/26`

**Step 2:** How many hosts per subnet?

Remaining host bits = 32 - 26 = 6 bits → 2⁶ = 64 addresses per subnet.
Usable hosts = 64 - 2 = **62** (subtract network and broadcast addresses).

**Step 3:** List the subnets:

| Subnet | Network Address | Usable Range | Broadcast |
|--------|----------------|--------------|-----------|
| 1 | 192.168.10.0/26 | .1 – .62 | .63 |
| 2 | 192.168.10.64/26 | .65 – .126 | .127 |
| 3 | 192.168.10.128/26 | .129 – .190 | .191 |
| 4 | 192.168.10.192/26 | .193 – .254 | .255 |

---

## Key Rules to Remember

- The **network address** (first IP) and **broadcast address** (last IP) can never be assigned to a device.
- Hosts on different subnets need a **router** to communicate.
- Practice with a subnet calculator until you can do it mentally — it comes up constantly.

---

## What I Struggled With

The most confusing part for me was understanding *why* the host count is `2^n - 2`. Once I saw that the all-zeros (network) and all-ones (broadcast) addresses are reserved, it clicked immediately.

Drawing the binary out by hand helped more than any tool or calculator.

---

*Next: [VLAN concepts and inter-VLAN routing](#) — coming soon.*
