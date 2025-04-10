﻿using System;
using System.Collections.Generic;

namespace BookStore.Models;

public partial class BookAuthor
{
    public Guid Id { get; set; }

    public int? Order { get; set; }

    public DateTime? Created { get; set; }

    public Guid? BookId { get; set; }

    public Guid? AuthorId { get; set; }

    public virtual Author? Author { get; set; }

    public virtual Book? Book { get; set; }
}
